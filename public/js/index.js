$(function(){
  let loginBox=$('#loginBox');
  let registerBox=$('#registerBox');
  let userInfo=$('#userInfo');

  loginBox.find('a.colMint').on('click',function() {
    registerBox.show();
    loginBox.hide();
  })
  registerBox.find('a.colMint').on('click',function() {
    loginBox.show();
    registerBox.hide();
  })

  registerBox.find('button').on('click',function() {
      $.ajax({
        type:'post',
        url:'/api/user/register',
        data:{
          username:registerBox.find('[name="username"]').val(),
          password:registerBox.find('[name="password"]').val(),
          repassword:registerBox.find('[name="repassword"]').val(),
        },
        dataType:'json',
        success:function(res){
          registerBox.find('.colWarning').html(res.message)
          if(!res.code){
            setTimeout(function() {
              window.location.reload()
            },1000)
          }
        }
      })
  })

  loginBox.find('button').on('click',function() {
      $.ajax({
        type:'post',
        url:'/api/user/login',
        data:{
          username:loginBox.find('[name="username"]').val(),
          password:loginBox.find('[name="password"]').val()
        },
        dataType:'json',
        success:function(res){
          loginBox.find('.colWarning').html(res.message)
          if(!res.code){
            window.location.reload()
          }
        }
      })
  })
  $('#logout').on('click',() => {
    $.ajax({
      url:'/api/user/logout',
      success:function(res) {
        if(!res.code){
          window.location.reload()
        }
      }
    })
  })

})
