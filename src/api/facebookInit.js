// import { accountService } from './accountService';

// const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;

// export function facebookInit() {
//     return new Promise(resolve => {
//         // wait for facebook sdk to initialize before starting the react app
//         window.fbAsyncInit = function () {
//             console.log("aiia");
//             window.FB.init({
//                 appId: facebookAppId,
//                 cookie: true,
//                 xfbml: true,
//                 version: 'v12.0'
//             })
//         window.FB.getLoginStatus(({ authResponse }) => {
//             if (authResponse) {
//                 accountService.apiAuthenticate(authResponse.accessToken).then(resolve);
//             } else {
//                 resolve();
//             }
//         })
//         }

//         // load facebook sdk script
//         (function (d, s, id) {
//             console.log(d, s, id);
//             console.log(d.getElementsByTagName(s)[0])
//             var js, fjs = d.getElementsByTagName(s)[0];
//             js = d.createElement(s); js.id = id;
//             console.log(js);
//             js.src = "https://connect.facebook.net/en_US/sdk.js";
//             console.log(js.src);
//             fjs.parentNode.insertBefore(js, fjs);
//         }(document, 'script', 'facebook-jssdk'));    
//     });
// }