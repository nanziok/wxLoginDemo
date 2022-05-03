//获取应用实例
const app = getApp()

Page({
    data: {
      userInfo: {},
      encryptedData: "",
      iv: "",
      rawData: "",
      signature: "",
      hasUserInfo: false,
      canIUseGetUserProfile: false,
      jscode: null,
    },
    onLoad() {
      console.log("onload");
      if (typeof(wx.getUserProfile) == 'function') {
        console.log("支持getUserProfile")
        this.setData({
          canIUseGetUserProfile: true
        })
      }
    },
    getUserProfile(e) {
      let that = this;
      console.log("session有效，继续操作");
      wx.checkSession({
          success: function(res) {
              wx.login({
                  timeout: 2000,
                  success: function(res){
                      that.setData({
                          jscode: res.code
                      })
                      console.log(res,'wx.login0')
                  },
                  fail: function(res){
                      console.log("微信登录失败",res);
                  }
              })
          },
          fail: (res)=>{
            console.log("check session err");
              wx.login({
                  timeout: 2000,
                  success: function(res){
                      this.setData({
                          jscode: res.code
                      })
                      console.log(res,'wx.login')
                  },
                  fail: function(res){
                      console.log("微信登录失败",res);
                  }
              })
          }
        })
        // return;
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            iv: res.iv,
            encryptedData: res.encryptedData, 
            rawData: res.rawData,
            signature: res.signature
          })
          console.log("getUserProfile-success", res);
          wx.request({
            url: 'https://www.daodanjiaoyugj.com/api/login/login',
            method: 'POST',
            data: {jscode:this.data.jscode,rawData:this.data.rawData,iv:this.data.iv,signature:this.data.signature,encryptedData:this.data.encryptedData}
          })
        }
      })
    },
    getUserInfo(e) {
      // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  })