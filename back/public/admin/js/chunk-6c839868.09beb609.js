(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6c839868"],{"81ef":function(e,t,n){},"8db2":function(e,t){e.exports={props:{id:{type:String,required:!0},name:{type:String,required:!0},value:{type:null,default:null},type:{type:String,required:!0},length:{type:[String,Number],default:null},readonly:{type:Boolean,default:!1},collection:{type:String,default:null},required:{type:Boolean,default:!1},options:{type:Object,default:()=>({})},newItem:{type:Boolean,default:!1},relation:{type:Object,default:null},fields:{type:Object,default:null},values:{type:Object,default:null},width:{type:String,default:null,validator(e){return["half","half-left","half-right","full","fill"].includes(e)}}}}},9353:function(e,t,n){"use strict";var l=n("81ef"),i=n.n(l);i.a},dae4:function(e,t,n){"use strict";n.r(t);var l=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"interface-password"},[n("v-input",{staticClass:"password first",attrs:{id:"first",type:e.inputType,placeholder:e.options.placeholder,value:e.value,readonly:e.readonly,"icon-right":e.lockIcon,"icon-right-color":e.iconColor},on:{input:function(t){return e.$emit("input",t)}}}),e._e()],1)},i=[],u=n("8db2"),a=n.n(u),o={mixins:[a.a],data:function(){return{originalValue:this.value||"",confirmValue:this.value||"",matches:!0}},computed:{valueChanged:function(){return this.value!==this.originalValue},inputType:function(){return this.options.hide?"password":"text"},lockIcon:function(){return this.valueChanged?"lock_open":"lock_outline"},iconColor:function(){return this.valueChanged?"warning":"accent"},confirmIcon:function(){return this.matches?"check":"close"},confirmColor:function(){return this.matches?"accent":"danger"}},watch:{value:function(){this.matches=this.value===this.confirmValue},confirmValue:function(){this.matches=this.value===this.confirmValue}}},r=o,c=(n("9353"),n("2877")),s=Object(c["a"])(r,l,i,!1,null,"05e75f9d",null);t["default"]=s.exports}}]);
//# sourceMappingURL=chunk-6c839868.09beb609.js.map