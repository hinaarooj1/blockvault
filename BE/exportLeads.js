const axios = require("axios");
const fs = require("fs");
const { Parser } = require("json2csv");

const API_URL = "https://crmatik.online/api/v1/Lead";
const MAX_SIZE = 150;
const TOTAL_LEADS = 42138;

const HEADERS = {
  Cookie:
    "auth-token=457c1a33c1fb546bda981bd270c71c30; auth-token-secret=989ea2af39f8b3b29e4aeda2b4fee1cb",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function safeRequest(url, options, retries = 3) {
  try {
    return await axios.get(url, options);
  } catch (err) {
    if (retries > 0) {
      console.log("Retrying...", url);
      await sleep(2000);
      return safeRequest(url, options, retries - 1);
    }
    throw err;
  }
}

async function exportLeadsWithStreams() {
  const filename = `all_leads_with_streams_${Date.now()}.csv`;
  const file = fs.createWriteStream(filename);

  const parser = new Parser({
    fields: [
      "leadId",
      "leadName",
      "leadStatus",
      "leadPhone",
      "leadCountry",
      "leadSource",
      "leadCompany",
      "leadCreatedAt",
      "leadOwner",
      "streamType",
      "streamValue",
      "streamCreatedAt",
      "streamCreatedBy",
    ],
  });

  // Write CSV header first
  file.write(parser.parse([]) + "\n");

  for (let offset = 0; offset < TOTAL_LEADS; offset += MAX_SIZE) {
    console.log(`📥 Fetching leads ${offset + 1} - ${offset + MAX_SIZE}`);

    const response = await safeRequest(API_URL, {
      params: {
        maxSize: MAX_SIZE,
        offset,
        orderBy: "createdAt",
        order: "desc",
      },
      headers: HEADERS,
    });

    const leads = response.data.list || [];

    for (const lead of leads) {
      await sleep(100); // throttling, avoid ban

      const streamRes = await safeRequest(
        `https://crmatik.online/api/v1/Lead/${lead.id}/stream`,
        {
          params: {
            maxSize: 100,
            offset: 0,
            orderBy: "number",
            order: "desc",
          },
          headers: HEADERS,
        }
      );

      const streams = streamRes.data.list || [];

      if (streams.length === 0) {
        const row = {
          leadId: lead.id,
          leadName: lead.name,
          leadStatus: lead.status,
          leadPhone: lead.phoneNumber,
          leadCountry: lead.addressCountry,
          leadSource: lead.cLeadsource,
          leadCompany: lead.cCompany,
          leadCreatedAt: lead.createdAt,
          leadOwner: lead.assignedUserName || "",
          streamType: "",
          streamValue: "",
          streamCreatedAt: "",
          streamCreatedBy: "",
        };
        file.write(parser.parse([row]) + "\n");
      } else {
        streams.forEach((s) => {
          let value = "";
          if (s.type === "Post") value = s.post || "";
          else if (s.type === "Status") value = s.data?.value || "";
          else if (s.type === "Assign") value = s.data?.assignedUserName || "";
          else value = JSON.stringify(s.data) || "";

          const row = {
            leadId: lead.id,
            leadName: lead.name,
            leadStatus: lead.status,
            leadPhone: lead.phoneNumber,
            leadCountry: lead.addressCountry,
            leadSource: lead.cLeadsource,
            leadCompany: lead.cCompany,
            leadCreatedAt: lead.createdAt,
            leadOwner: lead.assignedUserName || "",
            streamType: s.type,
            streamValue: value,
            streamCreatedAt: s.createdAt,
            streamCreatedBy: s.createdByName,
          };
          file.write(parser.parse([row]) + "\n");
        });
      }
    }
  }

  file.end();
  console.log(`✅ Export finished: ${filename}`);
}

// run directly
exportLeadsWithStreams().catch((err) => {
  console.error("❌ Export error:", err.message);
});
