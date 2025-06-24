export default [
  {
    path: '/public/files',
    name: 'roles_list',
    component: import('./file/views/FileList.vue'),
    meta: {
      breadcrumbs: [
        {
          label: 'accounts',
          icon: 'user-community-line'
        },
        {
          label: 'files',
          icon: 'award-line',
        },
      ]
    }
  },
]
