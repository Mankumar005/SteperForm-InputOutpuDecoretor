import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
  },
  {
    title: 'Shipments',
    icon: 'layout-outline',
    children: [
      {
        title: 'Shipment History',
        link: '/pages/shipments/shipments-history',
      },
      {
        title: 'Ship Now',
        link: '/pages/shipments/book-shipments',
      }
    ],
  },
  {
    title: 'Help',
    icon: 'question-mark-circle-outline',
    children: [
      {
        title: 'Contact Us',
        link: '/pages/help-desk/contact-us',
      },
      {
        title: 'FAQ',
        link: '/pages/help-desk/faq',
      }
    ],
  },
  {
    title: 'Admin Area',
    icon: 'award-outline',
    children: [
      {
          title: 'Accounts',
          icon: 'person-outline',
          children: [
            {
              title: 'Approved Account',
              link: '/pages/admin-area/accounts/approved-account',
            },
            {
              title: 'Pending Account',
              link: '/pages/admin-area/accounts/pending-account',
            }
          ]
        },
        {
          title: 'Master',
          icon: 'cube-outline',
          children: [
            {
              title: 'HSN Code List',
              link: '/pages/admin-area/master/hsn-code-list',
            },
            {
              title: 'Warehouse List',
              link: '/pages/admin-area/master/warehouse-list',
            },
            {
              title: 'Shipment Status List',
              link: '/pages/admin-area/shipment-status/shipment-status',
            },
            {
              title: 'Menu List',
              link: '/pages/admin-area/menu/menu-list',
            },
            {
              title: 'User Roles List',
              link: '/pages/admin-area/user-roles/user-roles-list',
            }
          ]
        },
        // {
        //   title: 'Menus',
        //   icon: 'message-square-outline',
        //   children: [
        //     {
        //       title: 'Menu List',
        //       link: '/pages/admin-area/menu/menu-list',
        //     }
        //   ]
        // },
        {
          title: 'Contact Us',
          icon: 'message-square-outline',
          children: [
            {
              title: 'Contact Us List',
              link: '/pages/admin-area/contact-us/contact-us-list',
            }
          ]
        },
        {
          title: 'Report',
          icon: 'printer-outline',
          children: [
            {
              title: 'Download',
              link: '/pages/admin-area/report/download',
            }
          ]
        },
        // {
        //   title: 'Shipment Status',
        //   icon: 'cube-outline',
        //   children: [
        //     {
        //       title: 'Shipment Status List',
        //       link: '/pages/admin-area/shipment-status/shipment-status',
        //     }
        //   ]
        // },
        // {
        //   title: 'Template',
        //   icon: 'email-outline',
        //   children: [
        //     {
        //       title: 'Email',
        //       link: '/pages/admin-area/template/email-tamplate',
        //     }
        //   ]
        // },
        {
          title: 'FAQ',
          icon: 'clipboard-outline',
          children: [
            {
              title: 'FAQ List',
              link: '/pages/admin-area/faq/faq-list',
            }
          ]
        },
        // {
        //   title: 'User Roles',
        //   icon: 'person-add-outline',
        //   children: [
        //     {
        //       title: 'User Roles List',
        //       link: '/pages/admin-area/user-roles/user-roles-list',
        //     }
        //   ]
        // },
    ]
  },
];
