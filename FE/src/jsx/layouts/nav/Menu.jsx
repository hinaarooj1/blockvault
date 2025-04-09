// import React, { useEffect,useState } from "react";
// import { useAuthUser, useSignOut } from "react-auth-kit";

// const [Admin, setAdmin] = useState("");
//  let authUser = useAuthUser();

// useEffect(() => {
//     if (authUser().user.role === "user") {
//         setAdmin(authUser().user);
//         return;
//     } else if (authUser().user.role === "admin") {
//         setAdmin(authUser().user);
//         return;
//     }
// }, []);
// export const MenuList = [

//     //Dashboard
//     {
//         title: 'Dashboard',
//         classsChange: 'mm-active',
//         to: '/dashboard',
//         iconStyle: <i className="material-symbols-outlined">dashboard</i>,

//     },
//     {
//         title: 'Market',
//         classsChange: 'mm-active',
//         to: '/market',
//         iconStyle: <i className="material-symbols-outlined">table</i>,

//     },
//     {
//         title: 'Edit Profile',
//         classsChange: 'mm-active',
//         to: '/edit-profile',
//         iconStyle: <i className="material-symbols-outlined">apps_outage</i>,

//     },
//     {
//         title: 'Documents',
//         classsChange: 'mm-active',
//         to: '/all-files',
//         iconStyle: <i className="material-symbols-outlined">request_quote</i>,

//     },
//     {
//         title: 'Assets',
//         classsChange: 'mm-active',
//         to: '/assets',
//         iconStyle: <i className="material-symbols-outlined">table_chart</i>,

//     },
//     {
//         title: 'Payment Methods',
//         classsChange: 'mm-active',
//         to: '/account',
//         iconStyle: <i className="material-symbols-outlined">monetization_on</i>,

//     },
//     {
//         title: 'Staking',
//         classsChange: 'mm-active',
//         to: '/staking',
//         iconStyle: <i className="material-symbols-outlined">widgets</i>,

//     },
//     {
//         title: 'Exchange',
//         classsChange: 'mm-active',
//         to: '/exchange',
//         iconStyle: <i className="material-symbols-outlined">request_quote</i>,

//     },
//     {
//         title: 'Swap',
//         classsChange: 'mm-active',
//         to: '/swap',
//         iconStyle: <i className="material-symbols-outlined">monitoring</i>,

//     },
//     {
//         title: 'Transactions',
//         classsChange: 'mm-active',
//         to: `/Transactions/${Admin._id}`,
//         iconStyle: <i className="material-symbols-outlined">lab_profile</i>,

//     },
//     {
//         title: 'Logout',
//         classsChange: 'mm-active',
//         to: '#',
//         onClick: "onLogout",
//         iconStyle: <i className="material-symbols-outlined"> </i>,

//     },






// ]
import React, { useEffect, useState } from "react";
import { useAuthUser, useSignOut } from "react-auth-kit";

const useMenuList = () => {
    const [Admin, setAdmin] = useState(null); // Initialize as null
    const authUser = useAuthUser();

    useEffect(() => {
        const user = authUser()?.user;
        if (user) {
            setAdmin(user);
        }
    }, [authUser]);

    return [

        //Dashboard
        {
            title: 'Dashboard',
            classsChange: 'mm-active',
            to: '/dashboard',
            iconStyle: <i className="material-symbols-outlined">dashboard</i>,

        },
        // {
        //     title: 'Market',
        //     classsChange: 'mm-active',
        //     to: '/market',
        //     iconStyle: <i className="material-symbols-outlined">table</i>,

        // },
        {
            title: 'Edit Profile',
            classsChange: 'mm-active',
            to: '/edit-profile',
            iconStyle: <i className="material-symbols-outlined">apps_outage</i>,

        },
        // {
        //     title: 'My Stocks',
        //     classsChange: 'mm-active',


        //     to: Admin ? `/stocks/${Admin._id}` : '#',
        //     iconStyle: <i className="material-symbols-outlined">table</i>,

        // },
        {
            title: 'Documents',
            classsChange: 'mm-active',
            to: '/all-files',
            iconStyle: <i className="material-symbols-outlined">request_quote</i>,

        },
        {
            title: 'Legal Notice',
            classsChange: 'mm-active',
            to: '/legal-notice',
            iconStyle: <i className="material-symbols-outlined">lab_profile</i>,

        },
        {
            title: 'Crypto Card',
            classsChange: 'mm-active',
            to: '/crypto-card',
            iconStyle: <i className="material-symbols-outlined">monetization_on</i>,

        },
        {
            title: 'Assets',
            classsChange: 'mm-active',
            to: '/assets',
            iconStyle: <i className="material-symbols-outlined">table_chart</i>,

        },
        {
            title: 'Exchanges',
            classsChange: 'mm-active',
            to: '/exchanges',
            iconStyle: <span class="fa-solid fa-arrow-right-arrow-left faris"></span>,

        },
        {
            title: 'Payment Methods',
            classsChange: 'mm-active',
            to: '/account',
            iconStyle: <i className="material-symbols-outlined">monetization_on</i>,

        },
        {
            title: 'Staking',
            classsChange: 'mm-active',
            to: '/staking',
            iconStyle: <i className="material-symbols-outlined">widgets</i>,

        },

        {
            title: 'Swap',
            classsChange: 'mm-active',
            to: '/swap',
            iconStyle: <i className="material-symbols-outlined">monitoring</i>,

        },
        {
            title: 'Transactions',
            classsChange: 'mm-active',
            to: Admin ? `/Transactions/${Admin._id}` : '#',
            iconStyle: <i className="material-symbols-outlined">lab_profile</i>,

        },
        {
            title: 'Logout',
            classsChange: 'mm-active',
            to: '#',
            onClick: "onLogout",
            iconStyle: <i className="material-symbols-outlined"> </i>,

        },
    ];
};

export default useMenuList;
