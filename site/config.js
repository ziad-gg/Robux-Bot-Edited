module.exports = {
  home: {
    Header: {
      home: {
        text: 'Home',
        url: '/',
        disabled: false,
      },
      commands: {
        text: 'Commands',
        url: '/commands',
        disabled: true,
      },
      tranfer: {
        text: 'Tranfer',
        url: '/dashboard#balance',
        disabled: false,
      },
      support: {
        text: 'Support',
        url: 'https://discord.gg/vbda2fvp',
        disabled: false,
      },
    },
    body: {
      p1: 'A multifunctional bot for helping <span class="text-purple">Robux</span> servers!',
      p2: 'Robux, Logs, and more with an easy Dashboard!',
      SupportButton: {
        style: 'secondary',
        url: 'https://discord.gg/vbda2fvp',
        text: 'Support'
      },
      DashboardButton: {
        style: 'primary',
        url: '/dashboard',
        text: 'Dashboard'
      },
      LoginButton: {
        style: 'primary',
        url: 'login/api',
        text: 'Login'
      },
      LogoutButton: {
        style: 'danger',
        url: '/logout',
        text: 'Logout'
      },
      LeftImg: {
        url: 'https://cdn.discordapp.com/attachments/1116475279012003931/1120062108873281676/robux.png'
      }, 
    }
  },
}