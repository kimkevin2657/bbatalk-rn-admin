(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[9],{"497e":function(e,a,t){"use strict";t("e011")},"50d9":function(e,a,t){},"82fb":function(e,a,t){"use strict";t("ac3d")},"9d30":function(e,a,t){"use strict";t("9e05")},"9e05":function(e,a,t){},abab:function(e,a,t){"use strict";t("50d9")},ac3d:function(e,a,t){},c1dc:function(e,a,t){"use strict";t.r(a);var s=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",[t("top",{scopedSlots:e._u([{key:"body",fn:function(){return[t("header-edit-template",{attrs:{disables:e.buttonDisables},on:{add:e.onAdd,edit:e.onEdit,remove:function(a){return e.onRemove(e.onRemove)}}})]},proxy:!0}])}),t("div",{staticClass:"q-pa-md"},[t("div",[t("div",{staticClass:"row form-row condition-box",staticStyle:{padding:"0px 5px 0px 0px"}},[t("q-btn",{attrs:{icon:e.isCard?"mdi-cards":"mdi-table-large",size:"xs",flat:""},on:{click:function(a){e.isCard=!e.isCard}}}),t("q-space"),t("q-select",{style:this.$q.screen.lt.md?"":"max-width: 120px;",attrs:{multiple:"",dense:"","display-value":"사용 컬럼","emit-value":"","map-options":"",options:e.columns,"option-value":"name"},on:{input:e.setColumns},model:{value:e.visibleColumns,callback:function(a){e.visibleColumns=a},expression:"visibleColumns"}}),t("q-input",{staticStyle:{"max-width":"160px",float:"right"},attrs:{dense:"",debounce:"300",placeholder:"검색"},scopedSlots:e._u([{key:"append",fn:function(){return[t("q-icon",{attrs:{name:"search"}})]},proxy:!0}]),model:{value:e.filter,callback:function(a){e.filter=a},expression:"filter"}})],1)]),t("q-table",{attrs:{grid:e.isCard,data:e.staffDataList,columns:e.columns,pagination:e.pagination,selected:e.rowsSelected,filter:e.filter,"visible-columns":e.visibleColumns,"row-key":"_id",separator:"cell",selection:"multiple","no-data-label":"데이터를 찾지 못하였습니다.","no-results-label":"검색된 결과가 없습니다.",dense:"",bordered:""},on:{"update:pagination":function(a){e.pagination=a},"update:selected":function(a){e.rowsSelected=a},"row-click":function(a,t){return e.onMultiRowClick(a,t)},"row-dblclick":function(a,t){e.$refs.staffRegistPopup.show(t),e.rowsSelected=[t]}},scopedSlots:e._u([{key:"body-cell-name",fn:function(a){return[t("q-td",{attrs:{props:a}},[t("q-item",{attrs:{dense:""}},[t("q-item-section",{attrs:{avatar:""}},[t("q-avatar",{staticStyle:{"margin-right":"2px"},attrs:{size:"44px",icon:null===a.row.photo?e.getFace(a.row.gender):void 0,"text-color":null===a.row.photo?e.getFaceColor(a.row.gender):void 0}},[a.row.photo?t("img",{attrs:{src:a.row.photo}}):e._e()])],1),t("q-item-section",[t("div",{staticClass:"text-blue-9 textlink",on:{click:function(t){return t.stopPropagation(),e.onClickDetailStaff(a.row._id)}}},[e._v(" "+e._s(a.value)+" ")]),t("span",[null!==a.row.photo?t("q-icon",{attrs:{name:e.getFace(a.row.gender),color:e.getFaceColor(a.row.gender)}}):e._e(),e._v("\n                "+e._s(a.row.special_n)+"\n              ")],1)])],1)],1)]}},{key:"bottom",fn:function(a){var s=a.pagesNumber;return[t("div",{staticClass:"row col-12",staticStyle:{display:"grid"}},[t("div",{staticClass:"justify-center",staticStyle:{display:"grid","grid-template-columns":"auto auto auto"}},[t("q-select",{staticStyle:{width:"75px"},attrs:{options:[10,20,30,40,50],label:"강사 수",dense:""},model:{value:e.pagination.rowsPerPage,callback:function(a){e.$set(e.pagination,"rowsPerPage",a)},expression:"pagination.rowsPerPage"}}),t("q-pagination",{attrs:{max:s,input:!0},model:{value:e.pagination.page,callback:function(a){e.$set(e.pagination,"page",a)},expression:"pagination.page"}})],1)])]}}])}),t("staff-regist-popup",{ref:"staffRegistPopup"})],1)],1)},i=[],o=(t("e6cf"),t("ded3")),r=t.n(o),n=t("2f62"),l=t("aac1"),c=t("6fb2"),f=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("default-dialog",{ref:"defaultDialog",attrs:{title:e.updateMode?"강사 수정":"강사 등록",width:500,height:950,useButtons:e.updateMode?["cancel","edit"]:["continue","cancel","confirm"]},on:{confirm:function(a){return e.onAdd()},edit:function(a){return e.onEdit()},continue:function(a){return e.onAdd(!0)}}},[t("div",{staticClass:"row",staticStyle:{margin:"0px"}},[t("div",{staticClass:"column col-12"},[t("div",{staticClass:"row"},[t("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"col-12",attrs:{name:"name",label:"* 강사명(국문)","data-vv-scope":"regstaff",error:e.errors.has("regstaff.name"),"error-message":e.getValidateMessage("name"),dense:""},scopedSlots:e._u([{key:"after",fn:function(){return[t("q-btn",{attrs:{flat:"",round:""},on:{click:function(a){return e.$refs.photoUploader.click()}}},[e.imageSrc?t("q-avatar",{attrs:{size:"50px"}},[t("img",{attrs:{src:e.imageSrc}})]):t("q-avatar",{attrs:{size:"50px","text-color":"blue-gray-9",icon:"mdi-face"}})],1)]},proxy:!0}]),model:{value:e.staffData.name,callback:function(a){e.$set(e.staffData,"name",a)},expression:"staffData.name"}}),t("q-input",{staticClass:"col-12",attrs:{label:"영문",dense:""},scopedSlots:e._u([{key:"after",fn:function(){return[t("q-option-group",{staticStyle:{"font-size":"14px"},attrs:{options:[{label:"남",value:"man"},{label:"여",value:"woman"}],color:"primary",inline:"",dense:""},model:{value:e.staffData.gender,callback:function(a){e.$set(e.staffData,"gender",a)},expression:"staffData.gender"}})]},proxy:!0}]),model:{value:e.staffData.engName,callback:function(a){e.$set(e.staffData,"engName",a)},expression:"staffData.engName"}}),t("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required|phone",expression:"'required|phone'"}],staticClass:"col-7",attrs:{name:"phone",label:"* 연락처",mask:"###-####-####","data-vv-scope":"regstaff",error:e.errors.has("regstaff.phone"),"error-message":e.getValidateMessage("phone"),dense:""},on:{blur:function(a){return e.updpateSecialNumber()}},model:{value:e.staffData.phone,callback:function(a){e.$set(e.staffData,"phone",a)},expression:"staffData.phone"}}),t("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"col-5",attrs:{name:"special_n",label:"* 강사 고유 번호","data-vv-scope":"regstaff",error:e.errors.has("regstaff.special_n"),"error-message":e.getValidateMessage("special_n"),readonly:"",dense:""},model:{value:e.staffData.special_n,callback:function(a){e.$set(e.staffData,"special_n",a)},expression:"staffData.special_n"}}),t("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"email",expression:"'email'"}],staticClass:"col-7",attrs:{name:"email",label:"이메일","data-vv-scope":"regstaff",error:e.errors.has("regstaff.email"),"error-message":e.getValidateMessage("email"),dense:""},model:{value:e.staffData.email,callback:function(a){e.$set(e.staffData,"email",a)},expression:"staffData.email"}}),t("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required|date",expression:"'required|date'"}],staticClass:"col-5",attrs:{name:"birth",dense:"","data-vv-scope":"regstaff",error:e.errors.has("regstaff.birth"),"error-message":e.getValidateMessage("birth"),hint:"2001-01-01 형식",mask:"####-##-##",label:"* 생년 월일"},model:{value:e.staffData.birth,callback:function(a){e.$set(e.staffData,"birth",a)},expression:"staffData.birth"}}),t("q-input",{staticClass:"col-12",staticStyle:{"margin-top":"15px"},attrs:{label:"주소",readonly:"",dense:""},scopedSlots:e._u([{key:"after",fn:function(){return[t("q-btn",{staticClass:"full-width",attrs:{color:"blue-grey-6",label:"주소검색",icon:"search",dense:""},on:{click:e.onClickAddress}})]},proxy:!0}]),model:{value:e.staffData.address_f,callback:function(a){e.$set(e.staffData,"address_f",a)},expression:"staffData.address_f"}},[e.staffData.address_f?t("q-tooltip",[e._v(e._s(e.staffData.address_f))]):e._e()],1),t("q-input",{staticClass:"col-12",attrs:{label:"상세 주소",name:"name",dense:""},model:{value:e.staffData.address_l,callback:function(a){e.$set(e.staffData,"address_l",a)},expression:"staffData.address_l"}}),t("q-select",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"col-6",attrs:{name:"team",options:e.teamOpts,label:"* 소속 부서","data-vv-scope":"regstaff",error:e.errors.has("regstaff.team"),"error-message":e.getValidateMessage("team"),dense:""},model:{value:e.staffData.team,callback:function(a){e.$set(e.staffData,"team",a)},expression:"staffData.team"}}),t("q-select",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"col-6",attrs:{name:"level",options:e.rankOpts,label:"* 직급","data-vv-scope":"regstaff",error:e.errors.has("regstaff.level"),"error-message":e.getValidateMessage("level"),dense:""},model:{value:e.staffData.level,callback:function(a){e.$set(e.staffData,"level",a)},expression:"staffData.level"}}),t("q-select",{staticClass:"col-12",attrs:{label:"선임 강사",name:"seniorid",options:e.staffOpts,"option-value":"_id","option-label":"label","emit-value":"","map-options":"","input-debounce":"0","hide-selected":"","use-input":"","fill-input":"",clearable:"",dense:"","hide-bottom-space":"",autocomplete:"off"},on:{filter:function(a,t){e.filterStaff=a,t()}},scopedSlots:e._u([{key:"no-option",fn:function(){return[t("q-item",[t("q-item-section",{staticClass:"text-grey"},[e._v("\n                검색 결과가 없습니다.\n              ")])],1)]},proxy:!0}]),model:{value:e.staffData.seniorid,callback:function(a){e.$set(e.staffData,"seniorid",a)},expression:"staffData.seniorid"}}),t("div",{staticClass:"col-12"},[t("q-checkbox",{staticStyle:{float:"right","margin-bottom":"0px"},attrs:{"left-label":"",dense:"",label:"운영 권한"},model:{value:e.staffData.isOperation,callback:function(a){e.$set(e.staffData,"isOperation",a)},expression:"staffData.isOperation"}}),t("q-checkbox",{staticStyle:{float:"right"},attrs:{"left-label":"",dense:"",label:"퇴사 여부"},model:{value:e.staffData.isLeave,callback:function(a){e.$set(e.staffData,"isLeave",a)},expression:"staffData.isLeave"}})],1),t("div",{staticClass:"col-12 q-mt-md"},[t("b",[e._v("경력 정보")])]),t("q-input",{staticClass:"col-12",attrs:{label:"학력/경력",autogrow:"",outlined:"",type:"textarea"},on:{focus:e.onFocusCareer},model:{value:e.staffData.career,callback:function(a){e.$set(e.staffData,"career",a)},expression:"staffData.career"}}),t("q-input",{staticClass:"col-12",attrs:{label:"자격 사항",autogrow:"",outlined:"",type:"textarea"},on:{focus:e.onFocusCertificate},model:{value:e.staffData.certificate,callback:function(a){e.$set(e.staffData,"certificate",a)},expression:"staffData.certificate"}}),t("div",{staticClass:"col-12 q-mt-md"},[t("b",[e._v("SNS 정보")])]),t("q-input",{staticClass:"col-12",attrs:{label:"Youtube ID",dense:""},scopedSlots:e._u([{key:"before",fn:function(){return[t("q-icon",{attrs:{name:"mdi-youtube",color:"red"}})]},proxy:!0}]),model:{value:e.staffData.youtubeid,callback:function(a){e.$set(e.staffData,"youtubeid",a)},expression:"staffData.youtubeid"}}),t("q-input",{staticClass:"col-12",attrs:{label:"Instargram ID",dense:""},scopedSlots:e._u([{key:"before",fn:function(){return[t("q-icon",{attrs:{name:"mdi-instagram"}})]},proxy:!0}]),model:{value:e.staffData.instarid,callback:function(a){e.$set(e.staffData,"instarid",a)},expression:"staffData.instarid"}}),t("q-input",{staticClass:"col-12",attrs:{label:"Facebook ID",dense:""},scopedSlots:e._u([{key:"before",fn:function(){return[t("q-icon",{attrs:{name:"mdi-facebook",color:"blue"}})]},proxy:!0}]),model:{value:e.staffData.facebookid,callback:function(a){e.$set(e.staffData,"facebookid",a)},expression:"staffData.facebookid"}}),t("q-input",{staticClass:"col-12",attrs:{label:"홈페이지",dense:""},scopedSlots:e._u([{key:"before",fn:function(){return[t("q-icon",{attrs:{name:"mdi-home"}})]},proxy:!0}]),model:{value:e.staffData.homepage,callback:function(a){e.$set(e.staffData,"homepage",a)},expression:"staffData.homepage"}}),t("q-input",{staticClass:"col-12",attrs:{label:"블로그",dense:""},scopedSlots:e._u([{key:"before",fn:function(){return[t("q-icon",{attrs:{name:"mdi-blogger",color:"teal"}})]},proxy:!0}]),model:{value:e.staffData.blog,callback:function(a){e.$set(e.staffData,"blog",a)},expression:"staffData.blog"}}),t("div",{staticClass:"col-12 q-mt-md"},[t("b",[e._v("급여 정보")])]),t("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"col-6",attrs:{name:"bankName",label:"* 은행명","data-vv-scope":"regstaff",error:e.errors.has("regstaff.bankName"),"error-message":e.getValidateMessage("bankName"),dense:""},model:{value:e.staffData.bank_n,callback:function(a){e.$set(e.staffData,"bank_n",a)},expression:"staffData.bank_n"}}),t("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"col-6",attrs:{name:"accountName",label:"* 예금주","data-vv-scope":"regstaff",error:e.errors.has("regstaff.accountName"),"error-message":e.getValidateMessage("accountName"),dense:""},model:{value:e.staffData.account_h,callback:function(a){e.$set(e.staffData,"account_h",a)},expression:"staffData.account_h"}}),t("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"col-12",attrs:{name:"accountNumber",label:"* 계좌 번호","data-vv-scope":"regstaff",error:e.errors.has("regstaff.accountNumber"),"error-message":e.getValidateMessage("accountNumber"),dense:""},model:{value:e.staffData.account_n,callback:function(a){e.$set(e.staffData,"account_n",a)},expression:"staffData.account_n"}})],1)]),t("q-separator",{staticClass:"col-12",staticStyle:{"margin-bottom":"10px"}}),t("div",{staticClass:"col-12"},[t("q-input",{staticStyle:{height:"100px"},attrs:{label:"메모",outlined:"",type:"textarea"},model:{value:e.staffData.memo,callback:function(a){e.$set(e.staffData,"memo",a)},expression:"staffData.memo"}})],1)],1),t("input",{ref:"photoUploader",staticStyle:{display:"none"},attrs:{type:"file"},on:{input:e.photoRegist}}),t("photo-cropper-popup",{ref:"photoCropperPopup",on:{cropImage:e.onCropedImage,reset:function(a){e.$refs.photoUploader.value=""}}}),t("road-popup",{ref:"roadPopup",on:{complete:e.onInjectAddress}})],1)},d=[],u=(t("c975"),t("ddb0"),t("5431")),p=t("0387"),m=t("d4da"),b=t("89f8"),g={name:"StaffRegistPopup",mixins:[b["a"]],inject:["$validator"],components:{DefaultDialog:u["a"],RoadPopup:m["a"],PhotoCropperPopup:p["a"]},computed:r()(r()(r()(r()({},Object(n["e"])("staff",["genSpecialNumber","staffData","staffDataList"])),Object(n["e"])("auth",["gymInfo"])),Object(n["e"])("defineDatas",["departmentDefineDataList","rankDefineDataList"])),{},{teamOpts(){return _.map(this.departmentDefineDataList,(e=>e.name))},rankOpts(){return _.map(this.rankDefineDataList,(e=>e.name))},staffOpts(){const e=this.filterStaff.toLowerCase();return _.map(this.staffDataList,(e=>{const a=e.team?`${e.team} `:"";return _.assignIn(e,{label:`${a}${e.name}(${e.special_n})`})})).filter((a=>a.label.toLowerCase().indexOf(e)>-1))}}),data(){return{imageSrc:void 0,updateMode:!1,filterStaff:""}},methods:r()(r()(r()(r()({},Object(n["b"])("staff",["reqGetStaffData","reqAddStaff","reqUpdateStaff","reqSpecialNumber"])),Object(n["d"])("staff",["initStaffData"])),Object(n["b"])("defineDatas",["reqGetDefineDataList"])),{},{show(e){this.initData(e),this.$refs.defaultDialog.show()},async initData(e){await Promise.all([this.reqGetDefineDataList({type:"department"}),this.reqGetDefineDataList({type:"rank"})]),e?(this.updateMode=!0,await this.reqGetStaffData({_id:e._id}),this.imageSrc=this.staffData.photo||void 0):(this.updateMode=!1,this.initStaffData(),this.imageSrc=void 0),await this.$nextTick(),this.errors.clear()},async onAdd(e=!1){const a=await this.$validator.validateAll("regstaff");if(!a)return this.$notify.error("잘못 입력 하였습니다.");try{const{code:a}=await this.reqAddStaff(this.staffData);"ok"===a&&(e||this.$refs.defaultDialog.hide())}catch(t){this.$notify.error(t.toString())}},async onEdit(){const e=await this.$validator.validateAll("regstaff");if(!e)return this.$notify.error("잘못 입력 하였습니다.");try{const{code:e}=await this.reqUpdateStaff();"ok"===e&&this.$refs.defaultDialog.hide()}catch(a){this.$notify.error(a.toString())}},onClickAddress(){this.$refs.roadPopup.show()},onInjectAddress(e){let a=e.address;_.has(e,"buildingName")&&(a+=`(${e.buildingName})`),this.staffData.address_f=a},async updpateSecialNumber(){const e=await this.$validator.validate("regstaff.phone");if(!e)return;const{code:a,msg:t,result:s}=await this.reqSpecialNumber({gymid:this.gymInfo.id,phone:this.staffData.phone});return"ok"===a?this.staffData.special_n=s:"err"===a&&this.$notify.error(t),a},photoRegist(e){const a=_.get(e,["target","files",0]);this.$refs.photoCropperPopup.show(a)},async onCropedImage(e){const a=await this.compress(e);this.imageSrc=a,this.staffData.photo=this.imageSrc,this.$refs.photoUploader.value=""},compress(e){return new Promise(((a,t)=>{const s=200,i=200,o=new Image;o.src=e,o.onload=()=>{const e=document.createElement("canvas");e.width=s,e.height=i;const t=e.getContext("2d");t.drawImage(o,0,0,s,i),a(t.canvas.toDataURL())}}))},onFocusCareer(){if(!this.staffData.career){const e=["[학력]"," - 대학교: OOO대학교, 기간: 2012-03 ~ 2015-02 (4년)","[경력]"," - 직장: OOO, 기간: 2015-03 ~ 2020-01 (5년 10개월)"];this.staffData.career=e.join("\n")}},onFocusCertificate(){if(!this.staffData.certificate){const e=["[면허]"," - 자격증: OOOOOO, 자격 번호: 1234-1234, 취득일: 2020-01-01"];this.staffData.certificate=e.join("\n")}}})},v=g,h=(t("9d30"),t("abab"),t("2877")),D=t("27f9"),q=t("9c40"),x=t("cb32"),w=t("9f0a"),y=t("05c0"),k=t("ddd8"),S=t("66e5"),C=t("4074"),$=t("8f8e"),O=t("0016"),N=t("eb85"),P=t("eebe"),I=t.n(P),Q=Object(h["a"])(v,f,d,!1,null,"25a92ebc",null),L=Q.exports;I()(Q,"components",{QInput:D["a"],QBtn:q["a"],QAvatar:x["a"],QOptionGroup:w["a"],QTooltip:y["a"],QSelect:k["a"],QItem:S["a"],QItemSection:C["a"],QCheckbox:$["a"],QIcon:O["a"],QSeparator:N["a"]});var M=t("4702"),j=t("cbe6"),R={name:"StaffState",components:{Top:l["a"],HeaderEditTemplate:c["a"],StaffRegistPopup:L},mixins:[M["a"],j["a"]],data(){return{isCard:!1,visibleColumns:["name","team","level","phone","regDate"],rowsSelected:[],pagination:{rowsPerPage:30},filter:"",current:1,registMultiple:[],activeOpts:["모두","활동중 강사","미활동 강사","퇴사한 강사"],teamOpts:["PT&PL","스쿼시","수영","골프","리인벤트","기타"],active:"모두",team:"모두",columns:[{name:"name",align:"left",label:"이름",field:"name",format:(e,a)=>{let t=e;return a.engName&&(t+=` (${a.engName})`),t},sortable:!0},{name:"team",align:"left",label:"소속 부서",field:"team",sortable:!0},{name:"level",align:"left",label:"직급",field:"level",sortable:!0},{name:"phone",align:"center",label:"휴대전화",field:"phone",sortable:!0},{name:"regDate",align:"center",label:"등록일자",field:"regDate",format:e=>this.$moment(e).format("YYYY-MM-DD"),sortable:!0}]}},computed:r()(r()(r()({},Object(n["e"])("staff",["staffDataList"])),Object(n["e"])("auth",["gymInfo"])),{},{buttonDisables(){const e=_.size(this.rowsSelected);return 0===e?["remove","edit"]:1===e?[]:e>1?["edit"]:[]}}),async mounted(){await this.reqGetStaffDataList({gymid:this.gymInfo.id})},methods:r()(r()({},Object(n["b"])("staff",["reqGetStaffDataList","reqGetStaffData","reqRemoveStaff"])),{},{onAdd(){this.$refs.staffRegistPopup.show()},onEdit(){this.$refs.staffRegistPopup.show(this.rowsSelected[0])},showRegPopup(e){this.$refs.staffRegistPopup.show(e)},async removeStaff(){try{let e={};1===_.size(this.rowsSelected)?e._id=_.get(this.rowsSelected,[0,"_id"],void 0):e.ids=_.map(this.rowsSelected,(e=>e._id));const{code:a}=await this.reqRemoveStaff(e);"ok"===a&&(this.rowsSelected=[])}catch(e){this.$notify.error(e)}},async onClickDetailStaff(e){await this.reqGetStaffData({_id:e}),this.$router.push("/manager/staff/StaffDetail")},getFace(e){return"woman"===e?"mdi-face-woman":"mdi-face"},getFaceColor(e){return"man"===e?"primary":"woman"===e?"negative":"black"}})},A=R,F=(t("82fb"),t("497e"),t("2c91")),G=t("eaac"),V=t("db86"),E=t("3b16"),z=Object(h["a"])(A,s,i,!1,null,"a6d679bc",null);a["default"]=z.exports;I()(z,"components",{QBtn:q["a"],QSpace:F["a"],QSelect:k["a"],QInput:D["a"],QIcon:O["a"],QTable:G["a"],QTd:V["a"],QItem:S["a"],QItemSection:C["a"],QAvatar:x["a"],QPagination:E["a"]})},e011:function(e,a,t){}}]);