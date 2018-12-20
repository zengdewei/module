/**
 * Created by Administrator on 2018/12/14.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {// AMD
        define(factory);
    } else if (typeof exports === 'object') {// Node, CommonJS之类的
        module.exports = factory();
    } else {// 浏览器全局变量(root 即 window)
        root.UI = factory();
    }
}(this, function () {
    let defaults = {
        prefix : '_ui',
        format : function (template,templateData){

            return template.replace(/{([^\}]+)}/g,function (v,p){
              return templateData.hasOwnProperty(p) ? templateData[p] : v || '';
            });
        }
    };
    class UI {
        constructor (opt){
            this.settings = Object.assign({},opt || {});
            this.el = this.settings.el;
            if(!this.el){
                throw new TypeError('el parameter cannot be empty.');
            }
            this.isDisable = false;
            this.el = this.el instanceof Object ? this.el : document.querySelector(this.el);
            this.template = this.settings.template || '';
            this.uid = defaults.prefix + new Date().getTime();
            if (this.template && !/^<[^>]+(uid=)[^>]+>/.test(this.template)) {
                this.template = this.template.replace('>', ' uid="' + this.uid + '">');
            }
            this.templateData = {uid:this.uid};
        }
        render() {
            this.el.innerHTML = defaults.format(this.template,this.templateData);
            this.dom = this.el.firstElementChild;
            return this;
        }
        getValue() {
            return this.dom.value;
        }
        setValue(v) {
            this.dom.value = v;
            let event = document.createEvent('HTMLEvents');
            event.initEvent('change',true,true);
            this.dom.dispatchEvent(event);
        }
        enable() {
            this.isDisable = false;
            this.dom.classList.remove('ui-disabled');
        }
        disable() {
            this.isDisable = true;
            this.dom.classList.add('ui-disabled');
        }
        validate() {

        }
        copy() {
            return new this.constructor(this.settings);
        }
    }

    class Input extends UI{
        constructor (opt = {}){
            opt.template = opt.template || `<input type="text" class="uiInputBox{class}" placeholder="{placeholder}" value="{value}" />`;
            super(opt);
            Object.assign(this.templateData,{
                'class'     : opt.class && (' ' + opt.class) || '',
                placeholder : opt.placeholder || '',
                value       : opt.value || ''
            });
        }
        disable() {
            this.dom.readonly = true;
            super.disable();
        }
        enable() {
            this.dom.readonly = false;
            super.enable();
        }
    }

    class TextArea extends Input{
        constructor(opt = {}) {
            opt.template = opt.template || `<textarea class="uiTextAreaBox{class}" placeholder="placeholder" value="{value}"></textarea>`;
            super(opt);
        }
    }

    class Select extends UI{
        constructor(opt = {}) {
            opt.template = opt.template || `<div class="ptf_seaSelectM"{css}>
									<div class="ptf_haveSelM">
										<span>{defaultText}</span>
										<em></em>
									</div>
									<div class="ptf_priceSel dis overflow_y">
										<ul{listCss}>{list}</ul>
									</div>
								</div>`;
            super(opt);
        }
    }

    return {
        Input       : Input,
        TextArea    : TextArea,
        Select      : Select
    }
}));
