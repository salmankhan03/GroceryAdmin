(this["webpackJsonpecommerce-admin"]=this["webpackJsonpecommerce-admin"]||[]).push([[37],{1278:function(e,a,t){"use strict";t.r(a);t(0);var s=t(25),n=t(40),r=t(96),c=t(166),i=t(199),l=t(169),o=(t(741),t(740)),d=t.p+"static/media/create-account-office.080280cb.jpeg",m=t.p+"static/media/create-account-office-dark.080280cb.jpeg",u=t(946),b=t.n(u),j=(t(947),t(3));a.default=()=>{const{t:e}=Object(r.a)(),{onSubmit:a,register:t,handleSubmit:u,errors:p,loading:h,setPhoneValue:g}=Object(o.a)();return Object(j.jsx)("div",{className:"flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900",children:Object(j.jsx)("div",{className:"flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800",children:Object(j.jsxs)("div",{className:"flex flex-col overflow-y-auto md:flex-row",children:[Object(j.jsxs)("div",{className:"h-32 md:h-auto md:w-1/2",children:[Object(j.jsx)("img",{"aria-hidden":"true",className:"object-cover w-full h-full dark:hidden",src:d,alt:"Office"}),Object(j.jsx)("img",{"aria-hidden":"true",className:"hidden object-cover w-full h-full dark:block",src:m,alt:"Office"})]}),Object(j.jsx)("main",{className:"flex items-center justify-center p-6 sm:p-12 md:w-1/2",children:Object(j.jsxs)("div",{className:"w-full",children:[Object(j.jsx)("h1",{className:"mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200",children:e("CreateAccount")}),Object(j.jsxs)("form",{onSubmit:u(a),children:[Object(j.jsx)(l.a,{label:"Name"}),Object(j.jsx)(i.a,{register:t,label:"Name",name:"name",type:"text",placeholder:"Admin"}),Object(j.jsx)(c.a,{errorName:p.name}),Object(j.jsx)(l.a,{label:"Email"}),Object(j.jsx)(i.a,{register:t,label:"Email",name:"email",type:"email",placeholder:"john@doe.com"}),Object(j.jsx)(c.a,{errorName:p.email}),Object(j.jsx)(l.a,{label:"Password"}),Object(j.jsx)(i.a,{register:t,label:"Password",name:"password",type:"password",placeholder:"***************"}),Object(j.jsx)(c.a,{errorName:p.password}),Object(j.jsx)(l.a,{label:"Phone Number"}),Object(j.jsxs)("div",{className:"col-span-8 sm:col-span-4",children:[Object(j.jsx)(b.a,{country:"ca",onChange:e=>{g(e)},className:"signUpPhoneInput"}),Object(j.jsx)(c.a,{errorName:p.phone})]}),Object(j.jsxs)(n.Label,{className:"mt-6",check:!0,children:[Object(j.jsx)(n.Input,{type:"checkbox"}),Object(j.jsxs)("span",{className:"ml-2",children:[e("Iagree")," ",Object(j.jsx)("span",{className:"underline",children:e("privacyPolicy")})]})]}),Object(j.jsx)(n.Button,{disabled:h,type:"submit",className:"mt-4 h-12 w-full",to:"/dashboard",block:!0,children:e("CreateAccountTitle")})]}),Object(j.jsx)("hr",{className:"my-10"}),Object(j.jsx)("p",{className:"mt-4",children:Object(j.jsx)(s.b,{className:"text-sm font-medium text-green-500 dark:text-green-400 hover:underline",to:"/login",children:e("AlreadyAccount")})})]})})]})})})}},166:function(e,a,t){"use strict";t(0);var s=t(3);a.a=e=>{let{errorName:a}=e;return Object(s.jsx)(s.Fragment,{children:a&&Object(s.jsx)("span",{className:"text-red-400 text-sm mt-2",children:a.message})})}},169:function(e,a,t){"use strict";t(0);var s=t(40),n=t(3);a.a=e=>{let{label:a}=e;return Object(n.jsx)(s.Label,{className:"col-span-4 sm:col-span-2 font-medium text-sm",children:a})}},199:function(e,a,t){"use strict";t(0);var s=t(40),n=t(3);a.a=e=>{let{register:a,defaultValue:t,required:r,name:c,label:i,type:l,placeholder:o,min:d,max:m,disabled:u}=e;return Object(n.jsx)(n.Fragment,{children:Object(n.jsx)(s.Input,{...a(`${c}`,{required:!r&&`${i} is required!`}),defaultValue:t,type:l,placeholder:o,name:c,className:"border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white",min:d,max:m,disabled:u})})}},236:function(e,a,t){"use strict";var s=t(99);const n={registerAdmin:async e=>s.a.post("/admin/signup",e),loginAdmin:async e=>s.a.post("/admin/login",e),forgetPassword:async e=>s.a.post("/forget-password",e),resetPassword:async e=>s.a.put("/admin/reset-password",e),signUpWithProvider:async e=>s.a.post("/admin/signup",e),addStaff:async e=>s.a.post("/admin/add",e),getAllStaff:async e=>s.a.get("/admin",e),getStaffById:async(e,a)=>s.a.post(`/admin/${e}`,a),updateStaff:async(e,a)=>s.a.put(`/admin/${e}`,a),updateStaffStatus:async(e,a)=>s.a.put(`/admin/update-status/${e}`,a),deleteStaff:async e=>s.a.delete(`/admin/${e}`)};a.a=n},740:function(e,a,t){"use strict";var s=t(18),n=t.n(s),r=t(0),c=t(237),i=t(6),l=t(26),o=t(236),d=t(42);a.a=()=>{const[e,a]=Object(r.useState)(!1),{dispatch:t}=Object(r.useContext)(l.a),s=Object(i.useHistory)(),[m,u]=Object(r.useState)(""),b=Object(i.useLocation)(),{register:j,handleSubmit:p,formState:{errors:h}}=Object(c.a)();return{onSubmit:e=>{let{name:r,email:c,verifyEmail:i,password:l,role:u}=e;a(!0);"/login"===b.pathname&&o.a.loginAdmin({email:c,password:l}).then((e=>{e&&(a(!1),Object(d.c)("Login Success!"),t({type:"USER_LOGIN",payload:e}),n.a.set("adminInfo",JSON.stringify(e),{expires:1e3}),s.replace("/"))})).catch((e=>{Object(d.b)(e?e.response.data.message:e.message),a(!1)})),"/signup"===b.pathname&&o.a.registerAdmin({name:r,email:c,password:l,phone:m}).then((e=>{e&&(a(!1),Object(d.c)("Register Success!"),t({type:"USER_LOGIN",payload:e}),n.a.set("adminInfo",JSON.stringify(e),{expires:1e3}),s.replace("/"))})).catch((e=>{Object(d.b)(e?e.response.data.message:e.message),a(!1)})),"/forgot-password"===b.pathname&&o.a.forgetPassword({email:i}).then((e=>{a(!1),Object(d.c)(e.message)})).catch((e=>{a(!1),Object(d.b)(e?e.response.data.message:e.message)}))},register:j,handleSubmit:p,errors:h,loading:e,setPhoneValue:u}}},741:function(e,a,t){"use strict";t(0);var s=t(40),n=t(3);a.a=e=>{let{setRole:a,register:t,name:r,label:c}=e;return Object(n.jsx)(n.Fragment,{children:Object(n.jsxs)(s.Select,{onChange:e=>a(e.target.value),className:"border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white",name:r,...t(`${r}`,{required:`${c} is required!`}),children:[Object(n.jsx)("option",{value:"",defaultValue:!0,hidden:!0,children:"Staff role"}),Object(n.jsx)("option",{value:"Admin",children:"Admin"}),Object(n.jsx)("option",{value:"CEO",children:"CEO"}),Object(n.jsx)("option",{value:"Manager",children:"Manager"}),Object(n.jsx)("option",{value:"Accountant",children:"Accountant"}),Object(n.jsx)("option",{value:"Driver",children:" Driver "}),Object(n.jsx)("option",{value:"Security Guard",children:"Security Guard"}),Object(n.jsx)("option",{value:"Deliver Person",children:"Delivery Person"})]})})}},99:function(e,a,t){"use strict";var s=t(164),n=t.n(s),r=t(18),c=t.n(r);const i=n.a.create({baseURL:"https://backend.kingsmankids.com/api",timeout:5e4,headers:{Accept:"application/json","Content-Type":"application/json"}});i.interceptors.request.use((function(e){let a,t;return c.a.get("adminInfo")&&(a=JSON.parse(c.a.get("adminInfo"))),c.a.get("company")&&(t=c.a.get("company")),{...e,headers:{authorization:a?`Bearer ${a.token}`:null,company:t||null}}})),i.interceptors.response.use((e=>e),(e=>(e.response&&401===e.response.status&&(console.log("Unauthorized access. Redirecting to login screen."),window.location.href="/login"),Promise.reject(e))));const l=e=>e.data,o={get:(e,a,t)=>i.get(e,a,t).then(l),post:(e,a)=>i.post(e,a).then(l),put:(e,a,t)=>i.put(e,a,t).then(l),patch:(e,a)=>i.patch(e,a).then(l),delete:(e,a)=>i.delete(e,a).then(l)};a.a=o}}]);
//# sourceMappingURL=37.c40a6110.chunk.js.map