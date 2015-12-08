(function(_super, $) {
    window.checkForm = function(formulaire) {
        if (!document.getElementById || !document.createTextNode) {
            return;
        }
        if (!formulaire.required) {
            return;
        }
        var error = false;
        var errortel = false;
        var errormail = false;
        var errorID = "errormsg";
        var errortelID = "errortel";
        var errormailID = "errormail";
        var errorClass = "error";
        var errorMsg = "";
        var reqfields = formulaire.required.value.split(",");
        // RAZ des classes error
        //document.getElementById(errorID).innerHTML = "";
        document.getElementById(errorID).style.display = "none";
        if (document.getElementById(errortelID)) {
            document.getElementById(errortelID).style.display = "none";
        }
        if (document.getElementById(errormailID)) {
            document.getElementById(errormailID).style.display = "none";
        }
        //$(errorID).removeClassName(errorClass);
        for (var i = 0, nbReqFields = reqfields.length; i < nbReqFields; i++) {
            var field = formulaire.elements[reqfields[i]];
            try {
                if (field.length > 1 && field[0].type.toLowerCase() == "radio") {
                    field = field[0];
                }
            } catch (err) {}
            if (field) {
                cf_removeerr(field);
            }
        }
        // boucle sur les champs requis
        for (var i = 0, nbReqFields = reqfields.length; i < nbReqFields; i++) {
            // vérifie que le champs requis est présent
            var field = formulaire.elements[reqfields[i]];
            try {
                if (field.length > 1 && field[0].type.toLowerCase() == "radio") {
                    field = field[0];
                }
            } catch (err) {}
            if (field) {
                // teste si le champ requis est erroné, en fonction de son type 
                switch (field.type.toLowerCase()) {
                  case "text":
                    if (field.value == "") {
                        cf_adderr(field);
                        error = true;
                    } else if (field.name.indexOf("mail") != -1 && !cf_listEmailAddr(field.value)) {
                        cf_adderr(field);
                        errormail = true;
                    } else if (field.name.indexOf("tel") != -1 && !cf_isTel(field.value)) {
                        cf_adderr(field);
                        errortel = true;
                    }
                    break;

                  case "textarea":
                    if (field.value == "") {
                        cf_adderr(field);
                        error = true;
                    }
                    break;

                  case "checkbox":
                    if (!field.checked) {
                        cf_adderr(field);
                        error = true;
                    }
                    break;

                  case "radio":
                    var isChecked = false;
                    for (var j = 0, nbRadio = formulaire.elements[field.name].length; j < nbRadio; j++) {
                        if (formulaire.elements[field.name][j].checked) {
                            isChecked = true;
                        }
                    }
                    if (!isChecked) {
                        cf_adderr(field);
                        error = true;
                    }
                    break;

                  case "select-one":
                    if (!field.selectedIndex && field.selectedIndex == 0) {
                        cf_adderr(field);
                        error = true;
                    }
                    break;
                }
            }
        }
        // Affiche le message d'erreur
        if (error) {
            //document.getElementById(errorID).innerHTML = errorMsg;
            document.getElementById(errorID).style.display = "block";
        }
        if (errormail) {
            //document.getElementById(error2ID).innerHTML = errorMsg;
            document.getElementById(errormailID).style.display = "block";
        }
        if (errortel) {
            //document.getElementById(error2ID).innerHTML = errorMsg;
            document.getElementById(errortelID).style.display = "block";
        }
        function cf_isEmailAddr(str) {
            return str.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/);
        }
        function cf_listEmailAddr(emails) {
            var listMail = emails.split(",");
            var valid = true;
            for (var i = 0; i < listMail.length; i++) {
                var emailClean = listMail[i].replace(/ /g, "");
                valid = cf_isEmailAddr(emailClean);
                if (!valid) {
                    break;
                }
            }
            return valid;
        }
        function cf_isTel(str) {
            return str.match(/^[\d]*$/) && str.length == 10;
        }
        function cf_adderr(elmt) {
            /*if(elmt.type.toLowerCase() == 'radio'){
			$("label[for='"+elmt.name+"']").addClass(errorClass);
		}
		$("label[for='"+elmt.id+"']").addClass(errorClass);*/
            $(elmt).addClass(errorClass);
        }
        function cf_removeerr(elmt) {
            /*if(elmt.type.toLowerCase() == 'radio'){
			$("label[for='"+elmt.name+"']").removeClass(errorClass);
		}
		$("label[for='"+elmt.id+"']").removeClass(errorClass);*/
            $(elmt).removeClass(errorClass);
        }
        return !error && !errormail && !errortel;
    };
})(window, jQuery);

/**
 *      Whatever:hover - V2.02.060206 - hover, active & focus
 *      ------------------------------------------------------------
 *      (c) 2005 - Peter Nederlof
 *      Peterned - http://www.xs4all.nl/~peterned/
 *      License  - http://creativecommons.org/licenses/LGPL/2.1/
 *
 *      Whatever:hover is free software; you can redistribute it and/or
 *      modify it under the terms of the GNU Lesser General Public
 *      License as published by the Free Software Foundation; either
 *      version 2.1 of the License, or (at your option) any later version.
 *
 *      Whatever:hover is distributed in the hope that it will be useful,
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of
 *      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 *      Lesser General Public License for more details.
 *
 *      Credits and thanks to:
 *      Arnoud Berendsen, Martin Reurings, Robert Hanson
 *
 *      howto: body { behavior:url("csshover.htc"); }
 *      ------------------------------------------------------------
 */
var csshoverReg = /(^|\s)((([^a]([^ ]+)?)|(a([^#.][^ ]+)+)):(hover|active))|((a|input|textarea)([#.][^ ]+)?:unknown)/i, currentSheet, doc = window.document, hoverEvents = [], activators = {
    onhover: {
        on: "onmouseover",
        off: "onmouseout"
    },
    onactive: {
        on: "onmousedown",
        off: "onmouseup"
    },
    onunknown: {
        on: "onfocus",
        off: "onblur"
    }
};

function parseStylesheets(idelmt) {
    if (!/MSIE (5|6)/.test(navigator.userAgent)) return;
    window.attachEvent("onunload", unhookHoverEvents);
    var sheets = doc.styleSheets, l = sheets.length;
    for (var i = 0; i < l; i++) parseStylesheet(sheets[i], idelmt);
}

function parseStylesheet(sheet, idelmt) {
    if (sheet.imports) {
        try {
            var imports = sheet.imports, l = imports.length;
            for (var i = 0; i < l; i++) parseStylesheet(sheet.imports[i], idelmt);
        } catch (securityException) {}
    }
    try {
        var rules = (currentSheet = sheet).rules, l = rules.length;
        for (var j = 0; j < l; j++) parseCSSRule(rules[j], idelmt);
    } catch (securityException) {}
}

function parseCSSRule(rule, idelmt) {
    var select = rule.selectorText, style = rule.style.cssText;
    if (!csshoverReg.test(select) || !style) return;
    var pseudo = select.replace(/[^:]+:([a-z-]+).*/i, "on$1");
    var newSelect = select.replace(/(\.([a-z0-9_-]+):[a-z]+)|(:[a-z]+)/gi, ".$2" + pseudo);
    var className = /\.([a-z0-9_-]*on(hover|active|unknown))/i.exec(newSelect)[1];
    var affected = select.replace(/:(hover|active|unknown).*$/, "");
    var elements = getElementsBySelect(affected, idelmt);
    if (elements.length == 0) return;
    currentSheet.addRule(newSelect, style);
    for (var i = 0; i < elements.length; i++) new HoverElement(elements[i], className, activators[pseudo]);
}

function HoverElement(node, className, events) {
    if (!node.hovers) node.hovers = {};
    if (node.hovers[className]) return;
    node.hovers[className] = true;
    hookHoverEvent(node, events.on, function() {
        node.className += " " + className;
    });
    hookHoverEvent(node, events.off, function() {
        node.className = node.className.replace(new RegExp("\\s+" + className, "g"), "");
    });
}

function hookHoverEvent(node, type, handler) {
    node.attachEvent(type, handler);
    hoverEvents[hoverEvents.length] = {
        node: node,
        type: type,
        handler: handler
    };
}

function unhookHoverEvents() {
    for (var e, i = 0; i < hoverEvents.length; i++) {
        e = hoverEvents[i];
        e.node.detachEvent(e.type, e.handler);
    }
}

function getElementsBySelect(rule, idelmt) {
    if (idelmt != null) {
        var parts, nodes = [ idelmt ];
    } else {
        var parts, nodes = [ doc ];
    }
    parts = rule.split(" ");
    for (var i = 0; i < parts.length; i++) {
        nodes = getSelectedNodes(parts[i], nodes);
    }
    return nodes;
}

function getSelectedNodes(select, elements) {
    var result, node, nodes = [];
    var identify = /\#([a-z0-9_-]+)/i.exec(select);
    if (identify) {
        var element = doc.getElementById(identify[1]);
        return element ? [ element ] : nodes;
    }
    var classname = /\.([a-z0-9_-]+)/i.exec(select);
    var tagName = select.replace(/(\.|\#|\:)[a-z0-9_-]+/i, "");
    var classReg = classname ? new RegExp("\\b" + classname[1] + "\\b") : false;
    for (var i = 0; i < elements.length; i++) {
        result = tagName ? elements[i].all.tags(tagName) : elements[i].all;
        for (var j = 0; j < result.length; j++) {
            node = result[j];
            if (classReg && !classReg.test(node.className)) continue;
            nodes[nodes.length] = node;
        }
    }
    return nodes;
}

// Generated by CoffeeScript 1.3.3
(function() {
    var AbstractPageView, AbstractVideoView, AbstractView, AppRouter, BgCollection, BgModel, BgView, DownloadCollection, DownloadItemCollection, DownloadItemModel, DownloadItemTypeCollection, DownloadItemTypeModel, DownloadItemTypeView, DownloadItemView, DownloadModel, DownloadView, DownloadsPageView, FilmPageView, FlashVideoView, FooterView, HeaderView, HomePageView, Html5VideoView, InfoPageView, IntroView, LogoView, MouseWatcher, NavItemView, NavView, PageCollection, PageContainerView, PageModel, Share, SharePageView, Tracking, __bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    }, __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };
    MouseWatcher = function() {
        MouseWatcher.prototype.$ = jQuery;
        MouseWatcher.prototype.is_active = true;
        MouseWatcher.prototype.timeout = 0;
        MouseWatcher.prototype.DELAY = 2e3;
        function MouseWatcher(auto_active) {
            if (auto_active == null) {
                auto_active = false;
            }
            this.get_status = __bind(this.get_status, this);
            this.set_status = __bind(this.set_status, this);
            this.on_mouse_activity = __bind(this.on_mouse_activity, this);
            this.on_mouse_inactivity = __bind(this.on_mouse_inactivity, this);
            this.on_mouse_action = __bind(this.on_mouse_action, this);
            this.clear_timeout = __bind(this.clear_timeout, this);
            this.arm_timeout = __bind(this.arm_timeout, this);
            this.deactive = __bind(this.deactive, this);
            this.active = __bind(this.active, this);
            if (auto_active) {
                this.active();
            }
        }
        MouseWatcher.prototype.active = function() {
            this.arm_timeout();
            this.$(document).mousemove(this.on_mouse_action);
            this.$(document).mousedown(this.on_mouse_action);
            return this;
        };
        MouseWatcher.prototype.deactive = function() {
            this.$(document).unbind("mousedown", this.on_mouse_action);
            this.$(document).unbind("mousemove", this.on_mouse_action);
            this.clear_timeout();
            this.on_mouse_activity();
            return this;
        };
        MouseWatcher.prototype.arm_timeout = function() {
            this.clear_timeout();
            return this.timeout = setTimeout(this.on_mouse_inactivity, this.DELAY);
        };
        MouseWatcher.prototype.clear_timeout = function() {
            if (this.timeout) {
                return clearInterval(this.timeout);
            }
        };
        MouseWatcher.prototype.on_mouse_action = function(event) {
            this.arm_timeout();
            return this.on_mouse_activity();
        };
        MouseWatcher.prototype.on_mouse_inactivity = function() {
            if (this.is_active) {
                this.$(this).trigger("mouse_inactive");
                return this.is_active = false;
            }
        };
        MouseWatcher.prototype.on_mouse_activity = function() {
            if (!this.is_active) {
                this.$(this).trigger("mouse_active");
                return this.is_active = true;
            }
        };
        MouseWatcher.prototype.set_status = function(is_active) {
            this.is_active = is_active;
            return this;
        };
        MouseWatcher.prototype.get_status = function() {
            return this.active;
        };
        return MouseWatcher;
    }();
    Share = function() {
        function Share() {}
        Share.prototype.$ = jQuery;
        Share.prototype.getKey = function(elId_) {
            var url, _this = this;
            url = cuwDic.share_form_get_key_url;
            url = "/" + sitelocEncoded + "ajax_proxy_chanel_service?url=" + url;
            console.log(url, sitelocEncoded);
            return this.$.ajax({
                type: "GET",
                url: url,
                dataType: "xml",
                success: function(xml) {
                    var key;
                    key = _this.$(xml).find("key").text();
                    return _this.$("#" + elId_).attr("value", key);
                }
            });
        };
        Share.prototype.shareMail = function(isFilm_) {
            var action, closeHref, imagesPath, newsletterUrl, siteUrl, template, templateURN, title, _this = this;
            if (isFilm_) {
                cuw.tracking.track(cuw.tracking.SHARE_FILM_EMAIL_CLICK);
            } else {
                cuw.tracking.track(cuw.tracking.SHARE_SITE_EMAIL_CLICK);
            }
            template = _.template(this.$("#template-email-form").html());
            action = cuwDic.share_form_submit_url;
            imagesPath = cuwDic.share_email_images_path;
            siteUrl = cuwDic.share_email_site_url;
            newsletterUrl = cuwDic.share_email_newsletter_url;
            if (isFilm_) {
                title = cuwDic.popup_email_film_title;
                closeHref = "cuw.closePopup(true);";
                templateURN = cuwDic.share_film_urn;
                templatePath = cuwDic.share_site_path;
            } else {
                title = cuwDic.popup_email_site_title;
                closeHref = "cuw.return();";
                templateURN = cuwDic.share_site_urn;
                templatePath = cuwDic.share_site_path;
            }
            this.$("#popin").html(template({
                title: title,
                closeHref: closeHref,
                action: action,
                templatePath: templatePath,
                templateURN: templateURN,
                imagesPath: imagesPath,
                siteUrl: siteUrl,
                newsletterUrl: newsletterUrl,
                alertFields: cuwDic.form_alert_fields,
                alertEmail: cuwDic.form_alert_email,
                requiredFields: cuwDic.form_required_fields,
                fieldYourSurname: cuwDic.form_field_your_surname,
                fieldYourName: cuwDic.form_field_your_name,
                fieldYourEmail: cuwDic.form_field_your_email,
                fieldFriendEmail: cuwDic.form_field_friend_email,
                submit: cuwDic.form_submit,
                message: cuwDic.form_message
            }));
            this.$("#popin").removeAttr("class");
            this.$("#popin").addClass("cuw-popup-email");
            if (!isFilm_) {
                this.$("#popin").addClass("cuw-popup-email-global");
            }
            this.$("#inline_popup").removeAttr("class");
            this.$("#inline_popup").css("display", "block");
            this.getKey("ChallengeKey");
            if (this.$("#partagerSubmit")) {
                this.$("#partagerSubmit").click(function(e_) {
                    e_.preventDefault();
                    if (checkForm(document.getElementById("partagerForm"))) {
                        _this.$("#nom").attr("value", _this.$("#nom").attr("value").toUpperCase());
                        _this.$("#prenom").attr("value", _this.$("#prenom").attr("value").toUpperCase());
                        _this.$("#nom").attr("name", "SenderName");
                        _this.$("#prenom").attr("name", "SenderFirstName");
                        _this.$("#mail1").attr("name", "SenderAddress");
                        _this.$("#mail2").attr("name", "RecipientAddress");
                        _this.$("#required").remove();
                        // START -- Mazarine Edit
                        //this.$('#partagerForm').submit();
                        url = cuwDic.share_form_submit_url;
                        url = "/" + sitelocEncoded + "ajax_proxy_chanel_service?url=" + url;
                        _this.$.ajax({
                            type: "POST",
                            url: url,
                            data: {
                                ChallengeKey: _this.$("#ChallengeKey").val(),
                                TemplatePath: templatePath,
                                TemplateURN: templateURN,
                                SenderName: _this.$("#prenom").val(),
                                SenderFirstName: _this.$("#nom").val(),
                                SenderAddress: _this.$("#mail1").val(),
                                RecipientAddress: _this.$("#mail2").val(),
                                BodyCustom0: imagesPath,
                                BodyCustom1: siteUrl,
                                BodyCustom2: newsletterUrl
                            }
                        }).done(function(msg) {});
                        // END -- Mazarine Edit
                        if (isFilm_) {
                            cuw.tracking.track(cuw.tracking.SHARE_FILM_EMAIL_SENT);
                        } else {
                            cuw.tracking.track(cuw.tracking.SHARE_SITE_EMAIL_SENT);
                        }
                        _this.$("#partage_form_title").stop().delay(300).animate({
                            opacity: 0
                        }, {
                            duration: 300
                        });
                        return _this.$("#partagerContent").stop().delay(300).animate({
                            opacity: 0
                        }, {
                            duration: 300,
                            complete: function() {
                                template = _.template(_this.$("#template-email-form-successful").html());
                                _this.$("#partagerContent").addClass("success");
                                _this.$("#partagerContent").html(template({
                                    title: cuwDic.form_confirmation_title,
                                    text: cuwDic.form_confirmation_text
                                }));
                                _this.$("#partagerContent").stop();
                                _this.$("#partagerContent").css("display", "block");
                                return _this.$("#partagerContent").css("opacity", 1);
                            }
                        });
                    }
                });
            }
            return cuw.popupOpenComplete();
        };
        Share.prototype.shareBlog = function(urlFLV) {
            var playerVersion, template;
            cuw.tracking.track(cuw.tracking.SHARE_FILM_EMBED_CLICK);
            template = _.template(this.$("#template-embed").html());
            playerVersion = 4;
            if (section === "joail") {
                switch (ch_lang) {
                  case "fr":
                    playerVersion = 1;
                    break;

                  case "en-gb":
                  case "en-us":
                    playerVersion = 2;
                    break;

                  default:
                    playerVersion = 3;
                }
            }
            this.$("#popin").html(template({
                title: cuwDic.popup_embed_title,
                urlFLV: urlFLV,
                playerVersion: playerVersion,
                closeHref: "cuw.closePopup(true);",
                basePath: cuwDic.basePath + path_site
            }));
            this.$("#popin").removeAttr("class");
            this.$("#popin").addClass("cuw-popup-embed");
            this.$("#inline_popup").removeAttr("class");
            this.$("#inline_popup").css("display", "block");
            this.$("#codeMedia").click(function() {
                return this.select();
            });
            return cuw.popupOpenComplete();
        };
        Share.prototype.shareSocial = function(network_, isFilm_) {
            var WT_sn_contentName, WT_sn_id, WT_sn_sense, WT_sn_websiteName, content, domain, form, img, shareUrl, title, url;
            if (network_ !== "facebook" && network_ !== "twitter" && network_ !== "weibo" && network_ !== "kaixin" && network_ !== "renren" && network_ !== "mixi") {
                return;
            }
            switch (network_) {
              case "facebook":
                if (isFilm_) {
                    cuw.tracking.track(cuw.tracking.SHARE_FILM_FACEBOOK_CLICK);
                } else {
                    cuw.tracking.track(cuw.tracking.SHARE_SITE_FACEBOOK_CLICK);
                }
                break;

              case "twitter":
                if (isFilm_) {
                    cuw.tracking.track(cuw.tracking.SHARE_FILM_TWITTER_CLICK);
                } else {
                    cuw.tracking.track(cuw.tracking.SHARE_SITE_TWITTER_CLICK);
                }
                break;

              case "weibo":
                if (isFilm_) {
                    cuw.tracking.track(cuw.tracking.SHARE_FILM_WEIBO_CLICK);
                } else {
                    cuw.tracking.track(cuw.tracking.SHARE_SITE_WEIBO_CLICK);
                }
                break;

              case "kaixin":
                if (isFilm_) {
                    cuw.tracking.track(cuw.tracking.SHARE_FILM_KAIXIN_CLICK);
                } else {
                    cuw.tracking.track(cuw.tracking.SHARE_SITE_KAIXIN_CLICK);
                }
                break;

              case "renren":
                if (isFilm_) {
                    cuw.tracking.track(cuw.tracking.SHARE_FILM_RENREN_CLICK);
                } else {
                    cuw.tracking.track(cuw.tracking.SHARE_SITE_RENREN_CLICK);
                }
                break;

              case "mixi":
                if (isFilm_) {
                    cuw.tracking.track(cuw.tracking.SHARE_FILM_MIXI_CLICK);
                } else {
                    cuw.tracking.track(cuw.tracking.SHARE_SITE_MIXI_CLICK);
                }
            }
            if (isFilm_) {
                switch (network_) {
                  case "facebook":
                    url = cuwDic.share_film_facebook_url;
                    title = cuwDic.share_film_facebook_title;
                    break;

                  case "twitter":
                    url = cuwDic.share_film_twitter_url;
                    title = cuwDic.share_film_twitter_title;
                    break;

                  case "weibo":
                    url = cuwDic.share_film_weibo_url;
                    title = cuwDic.share_film_weibo_title;
                    break;

                  case "kaixin":
                    url = cuwDic.share_film_kaixin_url;
                    title = cuwDic.share_film_kaixin_title;
                    break;

                  case "renren":
                    url = cuwDic.share_film_renren_url;
                    title = cuwDic.share_film_renren_title;
                    break;

                  case "mixi":
                    url = cuwDic.share_film_mixi_url;
                    title = cuwDic.share_film_mixi_title;
                }
                content = cuwDic.share_film_content;
                img = cuwDic.share_film_img;
                WT_sn_id = network_;
                WT_sn_contentName = cuwDic.share_film_content_name;
                WT_sn_websiteName = cuwDic.share_film_website_name;
                WT_sn_sense = cuwDic.share_film_sense;
            } else {
                switch (network_) {
                  case "facebook":
                    title = cuwDic.share_site_facebook_title;
                    break;

                  case "twitter":
                    title = cuwDic.share_site_twitter_title;
                    break;

                  case "weibo":
                    title = cuwDic.share_site_weibo_title;
                    break;

                  case "kaixin":
                    title = cuwDic.share_site_kaixin_title;
                    break;

                  case "renren":
                    title = cuwDic.share_site_renren_title;
                    break;

                  case "mixi":
                    title = cuwDic.share_site_mixi_title;
                }
                url = cuwDic.share_site_url;
                content = cuwDic.share_site_content;
                img = cuwDic.share_site_img;
                WT_sn_id = network_;
                WT_sn_contentName = cuwDic.share_site_content_name;
                WT_sn_websiteName = cuwDic.share_site_website_name;
                WT_sn_sense = cuwDic.share_site_sense;
            }
            form = this.$("#share-sn-form");
            if (network_ == "mixi") {
                form.attr("action", cuwDic.share_domain + "share/" + network_ + "/" + locale + "/0");
            } else {
                form.attr("action", cuwDic.share_domain + "share/" + network_ + "/" + locale + "/1");
            }
            form.html(" ");
            form.append('<input type="hidden" name="url"               value="' + url + '">');
            form.append('<input type="hidden" name="title"             value="' + title + '">');
            form.append('<input type="hidden" name="content"           value="' + content + '">');
            form.append('<input type="hidden" name="img"               value="' + img + '">');
            form.append('<input type="hidden" name="WT_sn_id"          value="' + WT_sn_id + '">');
            form.append('<input type="hidden" name="WT_sn_contentName" value="' + WT_sn_contentName + '">');
            form.append('<input type="hidden" name="WT_sn_websiteName" value="' + WT_sn_websiteName + '">');
            form.append('<input type="hidden" name="WT_sn_sense"       value="' + WT_sn_sense + '">');
            return form.submit();
        };
        return Share;
    }();
    /*
     
     
     WebTrends Analytics On Demand
     
     - visits/visitors/unique visitors 
     - visit duration
     - the page being visited
     - the page which was just left 
     - revisit information 
     - IP address 
     - country code/domain 
     - screen resolution 
     - browser and browser version 
     - window size 
     - JavaScript support 
     - regional settings 
     - etc 
     
     
     For user interaction call 'DcsMultiTrack()
     'DCS.dcsuri'    : URL of the page
     'WT.ti'         : Title of the page, by default Webtrends will use the current page Title
     'DCSext.ch_div' : Division ID
     'DCSext.ch_lang': Language ID ( eg: en-gb )
     
     
     Example:
     dcsMultiTrack(
     "DCS.dcsuri","PAGE URL", 
     "WT.ti","PAGE TITLE",
     "DCSext.ch_div","DIVISION VALUE",
     "DCSext.ch_re","chanelcom",
     "DCSext.ch_lang","LANG VALUE",
     "DCSext.ch_cat","CAT VALUE",
     "DCSext.ch_scat1","SCAT1 VALUE",
     "DCSext.ch_scat2","SCAT2 VALUE",
     "DCSext.ch_prod","PROD VALUE");
     
     
     stats(ch_re,ch_lang,cg_n,cg_s,ch_div,ch_cat,ch_scat1,ch_scat2,ch_prod,dl,pn_sku,tx_e)
     dcsMultiTrack("DCSext.ch_re",ch_re,"DCSext.ch_lang",ch_lang,"WT.cg_n",cg_n,"WT.cg_s",cg_s,"DCSext.ch_div",ch_div,"DCSext.ch_cat",ch_cat,"DCSext.ch_scat1",ch_scat1,"DCSext.ch_scat2",ch_scat2,"DCSext.ch_prod",ch_prod,"WT.dl",dl,"WT.pn_sku",pn_sku,"WT.tx_e",tx_e,"WT.clip_n",'',"WT.clip_ev",'');
     */
    Tracking = function() {
        Tracking.prototype.$ = jQuery;
        Tracking.prototype.device = "";
        Tracking.prototype.currentAction = "";
        Tracking.prototype.prevAction = "";
        Tracking.prototype.PAGE_HOME_VIEW = "-Main Page_View";
        Tracking.prototype.PAGE_FILM_VIEW = "-The Film Section_View";
        Tracking.prototype.PAGE_INFO_CAMPAIGN_VIEW = "-Inspiration The Campaign_View";
        Tracking.prototype.PAGE_INFO_STYLE_VIEW = "-Inspiration UltraStyle_View";
        Tracking.prototype.PAGE_DOWNLOADS_VIEW = "-Extras Main Page_View";
        Tracking.prototype.FILM_START = "-The Film_Start";
        Tracking.prototype.FILM_END = "-The Film_Ended";
        Tracking.prototype.WATCH_CLICK = "-Watch The Film_Click";
        Tracking.prototype.LOGO_CLICK = "-ChanelLogo_Click";
        Tracking.prototype.SHARE_SITE_CLICK = "-Ultrase Share_Click";
        Tracking.prototype.SHARE_SITE_FACEBOOK_CLICK = "-UltraUniverse Share Facebook_Click";
        Tracking.prototype.SHARE_SITE_TWITTER_CLICK = "-UltraUniverse Share Twitter_Click";
        Tracking.prototype.SHARE_SITE_WEIBO_CLICK = "-UltraUniverse Share Weibo_Click";
        Tracking.prototype.SHARE_SITE_KAIXIN_CLICK = "-UltraUniverse Share Kaixin_Click";
        Tracking.prototype.SHARE_SITE_RENREN_CLICK = "-UltraUniverse Share Renren_Click";
        Tracking.prototype.SHARE_SITE_EMAIL_CLICK = "-UltraUniverse Share Email_Click";
        Tracking.prototype.SHARE_SITE_EMAIL_SENT = "-UltraUniverse Share Email_Sent";
        Tracking.prototype.SHARE_SITE_EMAIL_CLICK = "-UltraUniverse Share Email_Click";
        Tracking.prototype.SHARE_SITE_EMAIL_SENT = "-UltraUniverse Share Email_Sent";
        Tracking.prototype.SHARE_FILM_FACEBOOK_CLICK = "-The Film Facebook_Click";
        Tracking.prototype.SHARE_FILM_TWITTER_CLICK = "-The Film Twitter_Click";
        Tracking.prototype.SHARE_FILM_WEIBO_CLICK = "-The Film Weibo_Click";
        Tracking.prototype.SHARE_FILM_KAIXIN_CLICK = "-The Film Kaixin_Click";
        Tracking.prototype.SHARE_FILM_RENREN_CLICK = "-The Film Renren_Click";
        Tracking.prototype.SHARE_FILM_SINA_CLICK = "-The Film Sina_Click";
        Tracking.prototype.SHARE_FILM_EMBED_CLICK = "-The Film Embedded_Click";
        Tracking.prototype.SHARE_FILM_EMAIL_CLICK = "-The Film Email_Click";
        Tracking.prototype.SHARE_FILM_EMAIL_SENT = "-The Film Email_Sent";
        Tracking.prototype.SCREENSAVER_PC_CLICK = "-Extras Screensaver PC_Click";
        Tracking.prototype.SCREENSAVER_MAC_CLICK = "-Extras Screensaver MAC_Click";
        Tracking.prototype.WALLPAPER_DESKTOP_CLICK = "-Extras Wallpaper Desktop_Click";
        Tracking.prototype.WALLPAPER_TABLET_CLICK = "-Extras Wallpaper Tablet_Click";
        function Tracking() {
            this.currentAction = this.prevAction = this.PAGE_HOME_VIEW;
            this.updateHiddenInput();
            if (cuwDic.is_mobile) {
                this.device = "Mobile";
            } else if (cuwDic.is_tablet) {
                this.device = "Tablet";
            } else {
                this.device = "Desktop";
            }
        }
        Tracking.prototype.updateHiddenInput = function() {
            this.$("#ch_scat1").attr("value", ch_scat1);
            this.$("#ch_scat2").attr("value", ch_scat2);
            this.$("#ch_prod").attr("value", ch_prod);
            this.$("#mc_id").attr("value", mc_id);
            this.$("#mc_t").attr("value", mc_t);
            this.$("#dl").attr("value", dl);
            return;
        };
        Tracking.prototype.trackPageView = function() {
            var action;
            switch (cuw.currentPageId) {
              case cuw.PAGE_HOME:
                action = this.PAGE_HOME_VIEW;
                break;

              case cuw.PAGE_FILM:
                action = this.PAGE_FILM_VIEW;
                break;

              case cuw.PAGE_INFO:
                action = this.PAGE_INFO_STYLE_VIEW;
                break;

              case cuw.PAGE_DOWNLOADS:
                action = this.PAGE_DOWNLOADS_VIEW;
                break;

              case cuw.PAGE_SHARE:
                return;
            }
            if (action) {
                return this.track(action);
            }
        };
        Tracking.prototype.track = function(action_) {
            console.log("- - - - - - CALL TRACK - - - - - - -", cuw.currentPageId);
            var ch_prod, ch_scat1, ch_scat2, dl;
            if (!action_) {
                return;
            }
            if (!/_click|_start|_view|_ended/i.test(action_.toLowerCase())) {
                if (action_ === this.currentAction) {
                    return;
                }
            }
            this.prevAction = this.currentAction;
            this.currentAction = action_;
            ch_scat1 = this.device + "-Ultra";
            switch (cuw.currentPageId) {
              case cuw.PAGE_HOME:
              case cuw.PAGE_SHARE:
                ch_scat2 = this.device + "-Home Page";
                break;

              case cuw.PAGE_FILM:
                ch_scat2 = this.device + "-The Film";
                break;

              case cuw.PAGE_INFO:
                ch_scat2 = this.device + "-Inspiration";
                break;

              case cuw.PAGE_DOWNLOADS:
                ch_scat2 = this.device + "-Extras";
            }
            ch_prod = this.device + this.currentAction;
            if (/_click|_start|_ended/i.test(this.currentAction.toLowerCase())) {
                dl = 50;
            } else {
                dl = 0;
            }
            this.updateHiddenInput();
            // if (!cuwDic.is_production) {
            console.log("- - - - - - - - - - - - - - - - - - - - - -");
            console.log(this.currentAction.toLowerCase());
            console.log("DCSext.ch_re:   ", ch_re, "\r\nDCSext.ch_lang: ", ch_lang, "\r\nWT.cg_n:        ", cg_n, "\r\nWT.cg_s:        ", cg_s, "\r\nDCSext.ch_div:  ", ch_div, "\r\nDCSext.ch_cat:  ", ch_cat, "\r\nDCSext.ch_scat1:", ch_scat1, "\r\nDCSext.ch_scat2:", ch_scat2, "\r\nDCSext.ch_prod: ", ch_prod, "\r\nWT.dl: ", dl, "\r\nmc_id: ", mc_id, "\r\nmc_t", mc_t);
            console.log("- - - - - - - - - - - - - - - - - - - - - -");
            // }
            return dcsMultiTrack("DCSext.ch_re", ch_re, "DCSext.ch_lang", ch_lang, "WT.cg_n", cg_n, "WT.cg_s", cg_s, "DCSext.ch_div", ch_div, "DCSext.ch_cat", ch_cat, "DCSext.ch_scat1", ch_scat1, "DCSext.ch_scat2", ch_scat2, "DCSext.ch_prod", ch_prod, "WT.dl", dl, "\r\nmc_id: ", mc_id, "\r\nmc_t", mc_t);
        };
        return Tracking;
    }();
    BgModel = function(_super) {
        __extends(BgModel, _super);
        function BgModel() {
            return BgModel.__super__.constructor.apply(this, arguments);
        }
        BgModel.prototype.defaults = {
            id: "",
            image: ""
        };
        return BgModel;
    }(Backbone.Model);
    DownloadItemModel = function(_super) {
        __extends(DownloadItemModel, _super);
        function DownloadItemModel() {
            return DownloadItemModel.__super__.constructor.apply(this, arguments);
        }
        DownloadItemModel.prototype.defaults = {
            label: "",
            thumbnail: "",
            typeCollection: null
        };
        return DownloadItemModel;
    }(Backbone.Model);
    DownloadItemTypeModel = function(_super) {
        __extends(DownloadItemTypeModel, _super);
        function DownloadItemTypeModel() {
            return DownloadItemTypeModel.__super__.constructor.apply(this, arguments);
        }
        DownloadItemTypeModel.prototype.defaults = {
            label: "",
            url: "",
            isWallpaper: true,
            isMac: false,
            isDesktop: true
        };
        return DownloadItemTypeModel;
    }(Backbone.Model);
    DownloadModel = function(_super) {
        __extends(DownloadModel, _super);
        function DownloadModel() {
            return DownloadModel.__super__.constructor.apply(this, arguments);
        }
        DownloadModel.prototype.defaults = {
            label: "",
            itemCollection: null
        };
        return DownloadModel;
    }(Backbone.Model);
    PageModel = function(_super) {
        __extends(PageModel, _super);
        function PageModel() {
            return PageModel.__super__.constructor.apply(this, arguments);
        }
        PageModel.prototype.defaults = {
            id: "",
            bgId: "",
            label: "",
            hideInNav: false
        };
        return PageModel;
    }(Backbone.Model);
    BgCollection = function(_super) {
        __extends(BgCollection, _super);
        function BgCollection() {
            return BgCollection.__super__.constructor.apply(this, arguments);
        }
        BgCollection.prototype.model = BgModel;
        return BgCollection;
    }(Backbone.Collection);
    DownloadCollection = function(_super) {
        __extends(DownloadCollection, _super);
        function DownloadCollection() {
            return DownloadCollection.__super__.constructor.apply(this, arguments);
        }
        DownloadCollection.prototype.model = DownloadModel;
        return DownloadCollection;
    }(Backbone.Collection);
    DownloadItemCollection = function(_super) {
        __extends(DownloadItemCollection, _super);
        function DownloadItemCollection() {
            return DownloadItemCollection.__super__.constructor.apply(this, arguments);
        }
        DownloadItemCollection.prototype.model = DownloadItemModel;
        return DownloadItemCollection;
    }(Backbone.Collection);
    DownloadItemTypeCollection = function(_super) {
        __extends(DownloadItemTypeCollection, _super);
        function DownloadItemTypeCollection() {
            return DownloadItemTypeCollection.__super__.constructor.apply(this, arguments);
        }
        DownloadItemTypeCollection.prototype.model = DownloadItemTypeModel;
        return DownloadItemTypeCollection;
    }(Backbone.Collection);
    PageCollection = function(_super) {
        __extends(PageCollection, _super);
        function PageCollection() {
            return PageCollection.__super__.constructor.apply(this, arguments);
        }
        PageCollection.prototype.model = PageModel;
        return PageCollection;
    }(Backbone.Collection);
    AppRouter = function(_super) {
        __extends(AppRouter, _super);
        function AppRouter() {
            return AppRouter.__super__.constructor.apply(this, arguments);
        }
        AppRouter.prototype.EVENT_HASH_CHANGED = "EVENT_HASH_CHANGED";
        AppRouter.prototype.navigateToPage = function(id_) {
            return this.trigger(this.EVENT_HASH_CHANGED, id_);
        };
        AppRouter.prototype.start = function(default_) {
            return this.navigateToPage(default_);
        };
        return AppRouter;
    }(Backbone.Router);
    AbstractView = function(_super) {
        __extends(AbstractView, _super);
        function AbstractView() {
            return AbstractView.__super__.constructor.apply(this, arguments);
        }
        AbstractView.prototype.$ = jQuery;
        AbstractView.prototype.id = null;
        AbstractView.prototype.el = null;
        AbstractView.prototype.$el = null;
        AbstractView.prototype.status = true;
        AbstractView.prototype.hasTransition = true;
        AbstractView.prototype.initialize = function() {
            if (this.id) {
                this.setElement(this.$("#" + this.id));
            } else {
                this.$el = this.$(this.el);
            }
            if (this.hasTransition) {
                this.hide();
            } else {
                this.$el.css("display", "block");
            }
            return this.init();
        };
        AbstractView.prototype.remove = function() {
            return this.$el.remove();
        };
        AbstractView.prototype.removeChildren = function() {
            return this.$el.children().remove();
        };
        AbstractView.prototype.hide = function() {
            if (!this.hasTransition) {
                return;
            }
            this.status = false;
            this.$el.stop();
            return this.$el.css("display", "none");
        };
        AbstractView.prototype.show = function(delay_, animate_) {
            if (delay_ == null) {
                delay_ = 0;
            }
            if (animate_ == null) {
                animate_ = true;
            }
            if (!this.hasTransition) {
                return;
            }
            this.status = true;
            this.$el.css("display", "block");
            if (!animate_) {
                return this.$el.css("opacity", 1);
            } else {
                this.$el.css("opacity", 0);
                return this.$el.stop().delay(delay_).animate({
                    opacity: 1
                }, {
                    duration: 300
                });
            }
        };
        AbstractView.prototype.init = function() {};
        return AbstractView;
    }(Backbone.View);
    BgView = function(_super) {
        __extends(BgView, _super);
        function BgView() {
            this.onAfter = __bind(this.onAfter, this);
            this.onBefore = __bind(this.onBefore, this);
            return BgView.__super__.constructor.apply(this, arguments);
        }
        BgView.prototype.id = "cuw-bg";
        BgView.prototype.hasTransition = false;
        BgView.prototype.currSlide = 0;
        BgView.prototype.init = function() {
            this.render();
            return this.start();
        };
        BgView.prototype.render = function() {
            var itemModel, _i, _len, _ref;
            _ref = cuw.bgCollection.models;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                itemModel = _ref[_i];
                this.appendItem(itemModel);
            }
            return this;
        };
        BgView.prototype.appendItem = function(model_) {
            var img;
            img = new Image();
            if (model_.get("id") === cuw.BG_HOME) {
                this.$(img).bind("load", function() {
                    return cuw.startIntro();
                });
                this.$(img, {
                    load: function() {
                        return cuw.startIntro();
                    }
                });
            }
            this.$(img).attr("id", model_.get("id"));
            img.src = model_.get("image");
            return this.$el.append(img);
        };
        BgView.prototype.start = function() {
            var i, l;
            i = 0;
            l = cuw.bgCollection.length;
            while (i < l) {
                if (cuw.bgCollection.at(i).get("id") === cuw.pageCollection.get(cuw.PAGE_DEFAULT).get("bgId")) {
                    this.currSlide = i;
                    i = l;
                }
                i++;
            }
            return this.$el.cycle({
                sync: 0,
                fx: "fade",
                easeIn: "easeInOutSine",
                easeOut: "easeInOutSine",
                speedIn: 1e3,
                speedOut: 500,
                timeout: 0,
                before: this.onBefore,
                after: this.onAfter,
                startingSlide: this.currSlide
            });
        };
        BgView.prototype.onBefore = function(curr_, next_, opts_) {};
        BgView.prototype.onAfter = function(curr_, next_, opts_) {
            return this.currSlide = opts_.currSlide;
        };
        BgView.prototype.change = function(id_) {
            var i, l;
            i = 0;
            l = cuw.bgCollection.length;
            while (i < l) {
                if (cuw.bgCollection.at(i).get("id") === id_) {
                    this.$el.cycle(i);
                    return;
                }
                i++;
            }
        };
        return BgView;
    }(AbstractView);
    AbstractVideoView = function(_super) {
        __extends(AbstractVideoView, _super);
        function AbstractVideoView() {
            return AbstractVideoView.__super__.constructor.apply(this, arguments);
        }
        AbstractVideoView.prototype.EVENT_STARTED = "EVENT_STARTED";
        AbstractVideoView.prototype.EVENT_ENDED = "EVENT_ENDED";
        AbstractVideoView.prototype.hasTransition = false;
        AbstractVideoView.prototype.template = null;
        AbstractVideoView.prototype.properties = {};
        AbstractVideoView.prototype.init = function() {
            return this;
        };
        AbstractVideoView.prototype.setProperties = function(properties_) {
            this.properties = properties_;
            return this.render();
        };
        AbstractVideoView.prototype.render = function() {
            this.setElement(this.template(this.properties));
            return this;
        };
        AbstractVideoView.prototype.play = function() {
            return this;
        };
        AbstractVideoView.prototype.pause = function() {
            return this;
        };
        return AbstractVideoView;
    }(AbstractView);
    FlashVideoView = function(_super) {
        __extends(FlashVideoView, _super);
        function FlashVideoView() {
            return FlashVideoView.__super__.constructor.apply(this, arguments);
        }
        FlashVideoView.prototype.init = function() {
            return this.template = _.template(this.$("#template-flash-video-player").html());
        };
        return FlashVideoView;
    }(AbstractVideoView);
    Html5VideoView = function(_super) {
        __extends(Html5VideoView, _super);
        function Html5VideoView() {
            this.onMovieEnded = __bind(this.onMovieEnded, this);
            this.onLoadStart = __bind(this.onLoadStart, this);
            this.timeoutComplete = __bind(this.timeoutComplete, this);
            return Html5VideoView.__super__.constructor.apply(this, arguments);
        }
        Html5VideoView.prototype.videoEl = null;
        Html5VideoView.prototype.hasControls = false;
        Html5VideoView.prototype.init = function() {
            return this.template = _.template(this.$("#template-html5-video-player").html());
        };
        Html5VideoView.prototype.start = function() {
            this.videoEl = document.getElementById(this.properties.id);
            this.videoEl.addEventListener("loadedmetadata", this.onLoadStart, false);
            return this.videoEl.addEventListener("ended", this.onMovieEnded, false);
        };
        Html5VideoView.prototype.play = function() {
            return this.videoEl.play();
        };
        Html5VideoView.prototype.pause = function() {
            return this.videoEl.pause();
        };
        Html5VideoView.prototype.addControls = function(delay_) {
            if (delay_ == null) {
                delay_ = 0;
            }
            if (!this.hasControls) {
                this.hasControls = true;
                return setTimeout(this.timeoutComplete, delay_);
            }
        };
        Html5VideoView.prototype.timeoutComplete = function() {
            return this.$(this.videoEl).attr("controls", "controls");
        };
        Html5VideoView.prototype.onLoadStart = function() {
            return this.trigger(this.EVENT_STARTED);
        };
        Html5VideoView.prototype.onMovieEnded = function() {
            return this.trigger(this.EVENT_ENDED);
        };
        /*
         onCanPlay: =>
         @video.removeEventListener 'canplaythrough', @onCanPlay, false
         @video.removeEventListener 'load', @onCanPlay, false
         
         #video is ready
         @video.play()
         */
        return Html5VideoView;
    }(AbstractVideoView);
    FooterView = function(_super) {
        __extends(FooterView, _super);
        function FooterView() {
            return FooterView.__super__.constructor.apply(this, arguments);
        }
        FooterView.prototype.id = "cuw-footer";
        FooterView.prototype.hasTransition = false;
        FooterView.prototype.navView = null;
        FooterView.prototype.init = function() {
            return this.navView = new NavView();
        };
        FooterView.prototype.change = function(id_) {
            return this.navView.change(id_);
        };
        return FooterView;
    }(AbstractView);
    NavItemView = function(_super) {
        __extends(NavItemView, _super);
        function NavItemView() {
            this.onClick = __bind(this.onClick, this);
            return NavItemView.__super__.constructor.apply(this, arguments);
        }
        NavItemView.prototype.hasTransition = false;
        NavItemView.prototype.model = null;
        NavItemView.prototype.template = null;
        NavItemView.prototype.allowClick = true;
        NavItemView.prototype.events = {
            click: "onClick"
        };
        NavItemView.prototype.init = function() {
            return this.template = _.template(this.$("#template-nav-item").html());
        };
        NavItemView.prototype.render = function() {
            this.setElement(this.template({
                label: this.model.get("label")
            }));
            return this;
        };
        NavItemView.prototype.onClick = function(e_) {
            e_.preventDefault();
            if (this.allowClick) {
                cuw.playFilm();
                return cuw.appRouter.navigateToPage(this.model.get("id"));
            }
        };
        NavItemView.prototype.pageId = function() {
            return this.model.get("id");
        };
        NavItemView.prototype.select = function(value_) {
            if (value_) {
                return this.$el.addClass("selected");
            } else {
                return this.$el.removeClass("selected");
            }
        };
        return NavItemView;
    }(AbstractView);
    NavView = function(_super) {
        __extends(NavView, _super);
        function NavView() {
            return NavView.__super__.constructor.apply(this, arguments);
        }
        NavView.prototype.id = "cuw-footer-nav";
        NavView.prototype.hasTransition = false;
        NavView.prototype.list = [];
        NavView.prototype.init = function() {
            return this.render();
        };
        NavView.prototype.render = function() {
            var i, itemModel, l, _i, _len, _ref;
            i = 0;
            l = cuw.pageCollection.length;
            _ref = cuw.pageCollection.models;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                itemModel = _ref[_i];
                if (!itemModel.get("hideInNav")) {
                    this.appendItem(itemModel);
                    if (i < l - 1 && !cuw.pageCollection.at(i + 1).get("hideInNav")) {
                        this.$el.append(this.$("#template-nav-item-division").html());
                    }
                }
                i++;
            }
            return this;
        };
        NavView.prototype.appendItem = function(model_) {
            var itemView;
            itemView = new NavItemView({
                model: model_
            });
            this.$el.append(itemView.render().el);
            return this.list.push(itemView);
        };
        NavView.prototype.change = function(id_) {
            var itemView, _i, _len, _ref, _results;
            _ref = this.list;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                itemView = _ref[_i];
                if (itemView.pageId() === id_) {
                    _results.push(itemView.select(true));
                } else {
                    _results.push(itemView.select(false));
                }
            }
            return _results;
        };
        NavView.prototype.allowClick = function(status_) {
            var itemView, _i, _len, _ref, _results;
            _ref = this.list;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                itemView = _ref[_i];
                _results.push(itemView.allowClick = status_);
            }
            return _results;
        };
        return NavView;
    }(AbstractView);
    HeaderView = function(_super) {
        __extends(HeaderView, _super);
        function HeaderView() {
            this.onShareOut = __bind(this.onShareOut, this);
            this.onShareOver = __bind(this.onShareOver, this);
            this.onEmailClick = __bind(this.onEmailClick, this);
            this.onTwitterClick = __bind(this.onTwitterClick, this);
            this.onFacebookClick = __bind(this.onFacebookClick, this);
            this.onWeiboClick = __bind(this.onWeiboClick, this);
            this.onKaixinClick = __bind(this.onKaixinClick, this);
            this.onRenrenClick = __bind(this.onRenrenClick, this);
            this.onMixiClick = __bind(this.onMixiClick, this);
            return HeaderView.__super__.constructor.apply(this, arguments);
        }
        HeaderView.prototype.id = "cuw-header";
        HeaderView.prototype.hasTransition = false;
        HeaderView.prototype.$backEl = null;
        HeaderView.prototype.$shareContainerEl = null;
        HeaderView.prototype.$shareTextEl = null;
        HeaderView.prototype.$shareIconsEl = null;
        HeaderView.prototype.$shareFacebookEl = null;
        HeaderView.prototype.$shareTwitterEl = null;
        HeaderView.prototype.$shareWeiboEl = null;
        HeaderView.prototype.$shareKaixinEl = null;
        HeaderView.prototype.$shareRenrenEl = null;
        HeaderView.prototype.$shareEmailEl = null;
        HeaderView.prototype.allowRollOver = true;
        HeaderView.prototype.isIconsVisible = false;
        HeaderView.prototype.init = function() {
            this.$backEl = this.$(this.$(".retour", this.$el)[0]);
            this.$shareContainerEl = this.$(this.$("#share-container", this.$el)[0]);
            this.$shareTextEl = this.$(this.$("#share-text", this.$el)[0]);
            this.$shareIconsEl = this.$(this.$("#share-icons", this.$el)[0]);
            this.$shareFacebookEl = this.$(this.$("#share-facebook", this.$el)[0]);
            this.$shareTwitterEl = this.$(this.$("#share-twitter", this.$el)[0]);
            this.$shareWeiboEl = this.$(this.$("#share-weibo", this.$el)[0]);
            this.$shareKaixinEl = this.$(this.$("#share-kaixin", this.$el)[0]);
            this.$shareRenrenEl = this.$(this.$("#share-renren", this.$el)[0]);
            this.$shareMixiEl = this.$(this.$("#share-mixi", this.$el)[0]);
            this.$shareEmailEl = this.$(this.$("#share-email", this.$el)[0]);
            this.$shareIconsEl.hide();
            this.$shareContainerEl.hover(this.onShareOver, this.onShareOut);
            if (cuwDic.hide_share) {
                this.$shareFacebookEl.remove();
                this.$shareTwitterEl.remove();
                this.$shareWeiboEl.remove();
                this.$shareKaixinEl.remove();
                this.$shareRenrenEl.remove();
                this.$shareMixiEl.remove();
            } else {
                this.$shareFacebookEl.click(this.onFacebookClick);
                this.$shareTwitterEl.click(this.onTwitterClick);
                this.$shareWeiboEl.click(this.onWeiboClick);
                this.$shareKaixinEl.click(this.onKaixinClick);
                this.$shareRenrenEl.click(this.onRenrenClick);
                this.$shareMixiEl.click(this.onMixiClick);
            }
            return this.$shareEmailEl.click(this.onEmailClick);
        };
        HeaderView.prototype.onFacebookClick = function(e_) {
            e_.preventDefault();
            if (this.isIconsVisible) {
                return cuw.appShare.shareSocial("facebook", false);
            }
        };
        HeaderView.prototype.onTwitterClick = function(e_) {
            e_.preventDefault();
            if (this.isIconsVisible) {
                return cuw.appShare.shareSocial("twitter", false);
            }
        };
        HeaderView.prototype.onWeiboClick = function(e_) {
            e_.preventDefault();
            if (this.isIconsVisible) {
                return cuw.appShare.shareSocial("weibo", false);
            }
        };
        HeaderView.prototype.onKaixinClick = function(e_) {
            e_.preventDefault();
            if (this.isIconsVisible) {
                return cuw.appShare.shareSocial("kaixin", false);
            }
        };
        HeaderView.prototype.onRenrenClick = function(e_) {
            e_.preventDefault();
            if (this.isIconsVisible) {
                return cuw.appShare.shareSocial("renren", false);
            }
        };
        HeaderView.prototype.onMixiClick = function(e_) {
            e_.preventDefault();
            if (this.isIconsVisible) {
                return cuw.appShare.shareSocial("mixi", false);
            }
        };
        HeaderView.prototype.onEmailClick = function(e_) {
            e_.preventDefault();
            if (this.isIconsVisible) {
                return cuw.appRouter.navigateToPage(cuw.PAGE_SHARE);
            }
        };
        HeaderView.prototype.onShareOver = function(e_) {
            e_.preventDefault();
            if (this.allowRollOver) {
                return this.showIcons();
            }
        };
        HeaderView.prototype.onShareOut = function(e_) {
            e_.preventDefault();
            if (this.allowRollOver) {
                return this.hideIcons();
            }
        };
        HeaderView.prototype.showIcons = function() {
            this.$shareTextEl.fadeOut("fast");
            this.$shareIconsEl.fadeIn("fast");
            return this.isIconsVisible = true;
        };
        HeaderView.prototype.hideIcons = function() {
            this.$shareTextEl.fadeIn("fast");
            this.$shareIconsEl.fadeOut("fast");
            return this.isIconsVisible = false;
        };
        return HeaderView;
    }(AbstractView);
    IntroView = function(_super) {
        __extends(IntroView, _super);
        function IntroView() {
            this.onShowComplete = __bind(this.onShowComplete, this);
            return IntroView.__super__.constructor.apply(this, arguments);
        }
        IntroView.prototype.id = "cuw-intro";
        IntroView.prototype.hasTransition = false;
        IntroView.prototype.hasStarted = false;
        IntroView.prototype.$leftEl = null;
        IntroView.prototype.$rightEl = null;
        IntroView.prototype.$leftLogoEl = null;
        IntroView.prototype.$rightLogoEl = null;
        IntroView.prototype.init = function() {
            this.$leftEl = this.$("#cuw-intro-left");
            this.$rightEl = this.$("#cuw-intro-right");
            this.$leftLogoEl = this.$("#cuw-intro-left-logo");
            return this.$rightLogoEl = this.$("#cuw-intro-right-logo");
        };
        IntroView.prototype.start = function() {
            var delay, duration;
            if (this.hasStarted) {
                return;
            }
            this.hasStarted = true;
            delay = 1100;
            duration = 1600;
            this.$leftEl.delay(delay).animate({
                width: 0
            }, {
                duration: duration,
                easing: "easeInOutCubic"
            });
            return this.$rightEl.delay(delay).animate({
                width: 0
            }, {
                duration: duration,
                easing: "easeInOutCubic",
                complete: this.onShowComplete
            });
        };
        IntroView.prototype.onShowComplete = function() {
            return this.$el.remove();
        };
        return IntroView;
    }(AbstractView);
    LogoView = function(_super) {
        __extends(LogoView, _super);
        function LogoView() {
            this.onLogoClick = __bind(this.onLogoClick, this);
            return LogoView.__super__.constructor.apply(this, arguments);
        }
        LogoView.prototype.id = "logo_chanel_joaillerie";
        LogoView.prototype.hasTransition = false;
        LogoView.prototype.init = function() {
            return this.$(this.$("#cuw-logo")[0]).click(this.onLogoClick);
        };
        LogoView.prototype.onLogoClick = function(e_) {
            return cuw.tracking.track(cuw.tracking.LOGO_CLICK);
        };
        return LogoView;
    }(AbstractView);
    AbstractPageView = function(_super) {
        __extends(AbstractPageView, _super);
        function AbstractPageView() {
            return AbstractPageView.__super__.constructor.apply(this, arguments);
        }
        AbstractPageView.prototype.model = null;
        AbstractPageView.prototype.pageId = function() {
            return this.model.get("id");
        };
        AbstractPageView.prototype.render = function() {
            return this;
        };
        AbstractPageView.prototype.beforeTransition = function(isCurrent_) {
            if (isCurrent_ == null) {
                isCurrent_ = false;
            }
            return this;
        };
        AbstractPageView.prototype.afterTransition = function(isCurrent_) {
            if (isCurrent_ == null) {
                isCurrent_ = false;
            }
            return this;
        };
        return AbstractPageView;
    }(AbstractView);
    DownloadItemTypeView = function(_super) {
        __extends(DownloadItemTypeView, _super);
        function DownloadItemTypeView() {
            this.onClick = __bind(this.onClick, this);
            return DownloadItemTypeView.__super__.constructor.apply(this, arguments);
        }
        DownloadItemTypeView.prototype.hasTransition = false;
        DownloadItemTypeView.prototype.model = null;
        DownloadItemTypeView.prototype.template = null;
        DownloadItemTypeView.prototype.events = {
            "click a": "onClick"
        };
        DownloadItemTypeView.prototype.init = function() {
            return this.template = _.template(this.$("#template-download-item-type").html());
        };
        DownloadItemTypeView.prototype.render = function() {
            this.setElement(this.template({
                url: this.model.get("url"),
                label: this.model.get("label")
            }));
            return this;
        };
        DownloadItemTypeView.prototype.onClick = function(e_) {
            if (this.model.get("isWallpaper")) {
                if (this.model.get("isDesktop")) {
                    return cuw.tracking.track(cuw.tracking.WALLPAPER_DESKTOP_CLICK);
                } else {
                    return cuw.tracking.track(cuw.tracking.WALLPAPER_TABLET_CLICK);
                }
            } else {
                if (this.model.get("isMac")) {
                    return cuw.tracking.track(cuw.tracking.SCREENSAVER_MAC_CLICK);
                } else {
                    return cuw.tracking.track(cuw.tracking.SCREENSAVER_PC_CLICK);
                }
            }
        };
        return DownloadItemTypeView;
    }(AbstractView);
    DownloadItemView = function(_super) {
        __extends(DownloadItemView, _super);
        function DownloadItemView() {
            this.onClick = __bind(this.onClick, this);
            return DownloadItemView.__super__.constructor.apply(this, arguments);
        }
        DownloadItemView.prototype.hasTransition = false;
        DownloadItemView.prototype.model = null;
        DownloadItemView.prototype.template = null;
        DownloadItemView.prototype.$innerEl = null;
        DownloadItemView.prototype.init = function() {
            return this.template = _.template(this.$("#template-download-item").html());
        };
        DownloadItemView.prototype.render = function() {
            var itemModel, l, _i, _len, _ref;
            this.setElement(this.template({
                image: this.model.get("thumbnail"),
                label: this.model.get("label")
            }));
            this.$innerEl = this.$("#download-nav", this.$el);
            l = this.model.get("typeCollection").length;
            if (l > 1) {
                _ref = this.model.get("typeCollection").models;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    itemModel = _ref[_i];
                    this.appendItem(itemModel);
                }
            } else if (l === 1) {
                this.$el.css("cursor", "pointer");
                this.$el.click(this.onClick);
            }
            return this;
        };
        DownloadItemView.prototype.appendItem = function(model_) {
            var itemView;
            itemView = new DownloadItemTypeView({
                model: model_
            });
            return this.$innerEl.append(itemView.render().el);
        };
        DownloadItemView.prototype.onClick = function(e_) {
            var firstModel;
            e_.preventDefault();
            firstModel = this.model.get("typeCollection").at(0);
            if (firstModel.get("isWallpaper")) {
                if (firstModel.get("isDesktop")) {
                    cuw.tracking.track(cuw.tracking.WALLPAPER_DESKTOP_CLICK);
                } else {
                    cuw.tracking.track(cuw.tracking.WALLPAPER_TABLET_CLICK);
                }
            } else {
                if (firstModel.get("isMac")) {
                    cuw.tracking.track(cuw.tracking.SCREENSAVER_MAC_CLICK);
                } else {
                    cuw.tracking.track(cuw.tracking.SCREENSAVER_PC_CLICK);
                }
            }
            return window.open(firstModel.get("url"));
        };
        return DownloadItemView;
    }(AbstractView);
    DownloadsPageView = function(_super) {
        __extends(DownloadsPageView, _super);
        function DownloadsPageView() {
            return DownloadsPageView.__super__.constructor.apply(this, arguments);
        }
        DownloadsPageView.prototype.hasTransition = false;
        DownloadsPageView.prototype.$innerEl = null;
        DownloadsPageView.prototype.list = [];
        DownloadsPageView.prototype.init = function() {
            var itemModel, _i, _len, _ref;
            this.$innerEl = this.$("#cuw-page-downloads-inner");
            _ref = cuw.downloadCollection.models;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                itemModel = _ref[_i];
                this.appendItem(itemModel);
            }
            if (cuw.downloadCollection.length === 1) {
                return this.$innerEl.addClass("single");
            }
        };
        DownloadsPageView.prototype.appendItem = function(model_) {
            var itemView;
            itemView = new DownloadView({
                model: model_
            });
            this.$innerEl.append(itemView.render().el);
            return this.list.push(itemView);
        };
        DownloadsPageView.prototype.beforeTransition = function(isCurrent_) {
            var itemView, _i, _len, _ref, _results;
            if (isCurrent_) {
                _ref = this.list;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    itemView = _ref[_i];
                    _results.push(itemView.start());
                }
                return _results;
            }
        };
        return DownloadsPageView;
    }(AbstractPageView);
    DownloadView = function(_super) {
        __extends(DownloadView, _super);
        function DownloadView() {
            this.onPrev = __bind(this.onPrev, this);
            this.onNext = __bind(this.onNext, this);
            this.onAfter = __bind(this.onAfter, this);
            this.onBefore = __bind(this.onBefore, this);
            return DownloadView.__super__.constructor.apply(this, arguments);
        }
        DownloadView.prototype.hasTransition = false;
        DownloadView.prototype.model = null;
        DownloadView.prototype.template = null;
        DownloadView.prototype.$innerEl = null;
        DownloadView.prototype.$arrowLeftEl = null;
        DownloadView.prototype.$arrowRightEl = null;
        DownloadView.prototype.currSlide = 0;
        DownloadView.prototype.numSlide = 0;
        DownloadView.prototype.allowClick = true;
        DownloadView.prototype.init = function() {
            return this.template = _.template(this.$("#template-download").html());
        };
        DownloadView.prototype.render = function() {
            var itemModel, _i, _len, _ref;
            this.numSlide = this.model.get("itemCollection").length;
            this.setElement(this.template({
                label: this.model.get("label")
            }));
            this.$innerEl = this.$(".cycle-container", this.$el);
            this.$arrowLeftEl = this.$("#arrow-left", this.$el);
            this.$arrowRightEl = this.$("#arrow-right", this.$el);
            _ref = this.model.get("itemCollection").models;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                itemModel = _ref[_i];
                this.appendItem(itemModel);
            }
            if (this.numSlide > 1) {
                this.$innerEl.cycle({
                    fx: "scrollHorz",
                    easing: "easeInOutSine",
                    speed: 700,
                    timeout: 0,
                    before: this.onBefore,
                    after: this.onAfter,
                    startingSlide: this.currSlide
                });
                this.$arrowLeftEl.click(this.onPrev);
                this.$arrowRightEl.click(this.onNext);
            } else {
                this.$arrowLeftEl.remove();
                this.$arrowLeftEl = null;
                this.$arrowRightEl.remove();
                this.$arrowRightEl = null;
            }
            return this;
        };
        DownloadView.prototype.start = function() {
            this.currSlide = 0;
            this.$innerEl.cycle(this.currSlide);
            return this.updateArrows(this.currSlide, false);
        };
        DownloadView.prototype.appendItem = function(model_) {
            var itemView;
            itemView = new DownloadItemView({
                model: model_
            });
            return this.$innerEl.append(itemView.render().el);
        };
        DownloadView.prototype.updateArrows = function(index_, transition_) {
            if (transition_ == null) {
                transition_ = true;
            }
            if (this.$arrowRightEl) {
                if (index_ === this.numSlide - 1) {
                    if (transition_) {
                        this.$arrowRightEl.fadeOut("fast");
                    } else {
                        this.$arrowRightEl.hide();
                    }
                } else {
                    if (transition_) {
                        this.$arrowRightEl.fadeIn("fast");
                    } else {
                        this.$arrowRightEl.show();
                    }
                }
            }
            if (this.$arrowLeftEl) {
                if (index_ === 0) {
                    if (transition_) {
                        return this.$arrowLeftEl.fadeOut("fast");
                    } else {
                        return this.$arrowLeftEl.hide();
                    }
                } else {
                    if (transition_) {
                        return this.$arrowLeftEl.fadeIn("fast");
                    } else {
                        return this.$arrowLeftEl.show();
                    }
                }
            }
        };
        DownloadView.prototype.onBefore = function(curr_, next_, opts_) {
            this.allowClick = false;
            return this.updateArrows(this.currSlide);
        };
        DownloadView.prototype.onAfter = function(curr_, next_, opts_) {
            this.currSlide = opts_.currSlide;
            return this.allowClick = true;
        };
        DownloadView.prototype.onNext = function(e_) {
            e_.preventDefault();
            if (this.currSlide === this.numSlide - 1) {
                return;
            }
            this.currSlide++;
            if (this.allowClick) {
                return this.$innerEl.cycle("next");
            }
        };
        DownloadView.prototype.onPrev = function(e_) {
            e_.preventDefault();
            if (this.currSlide === 0) {
                return;
            }
            this.currSlide--;
            if (this.allowClick) {
                return this.$innerEl.cycle("prev");
            }
        };
        return DownloadView;
    }(AbstractView);
    FilmPageView = function(_super) {
        __extends(FilmPageView, _super);
        function FilmPageView() {
            this.onEnded = __bind(this.onEnded, this);
            this.onStarted = __bind(this.onStarted, this);
            return FilmPageView.__super__.constructor.apply(this, arguments);
        }
        FilmPageView.prototype.hasTransition = false;
        FilmPageView.prototype.html5VideoView = null;
        FilmPageView.prototype.flashVideoView = null;
        FilmPageView.prototype.init = function() {
            console.log("assets_base_path > " + cuwDic.assets_base_path);
            if (cuw.isHTML5Video()) {
                this.html5VideoView = new Html5VideoView();
                if (cuw.isSmall()) {
                    this.html5VideoView.setProperties({
                        id: cuw.VIDEO_ID_FILM,
                        mp4: "assets/ultra/films/film-sd.mp4",
                        ogv: "assets/ultra/films/film-sd.ogv",
                        webm: "assets/ultra/films/film-sd.webm"
                    });
                } else {
                    this.html5VideoView.setProperties({
                        id: cuw.VIDEO_ID_FILM,
                        mp4: "assets/ultra/films/film-sd.mp4",
                        ogv: "assets/ultra/films/film-sd.ogv",
                        webm: "assets/ultra/films/film-sd.webm"
                    });
                }
                this.$el.append(this.html5VideoView.el);
                this.html5VideoView.start();
                this.html5VideoView.on(this.html5VideoView.EVENT_STARTED, this.onStarted);
                return this.html5VideoView.on(this.html5VideoView.EVENT_ENDED, this.onEnded);
            } else {
                this.flashVideoView = new FlashVideoView();
                if (cuw.isSmall()) {
                    this.flashVideoView.setProperties({
                        id: cuw.VIDEO_ID_FILM,
                        sd: "assets/ultra/films/film-sd.mp4",
                        hd: "assets/ultra/films/film-hd.mp4",
                        width: 1e3,
                        height: 562,
                        controlsOffsetY: -42,
                        hideShare: cuwDic.hide_share
                    });
                } else {
                    this.flashVideoView.setProperties({
                        id: cuw.VIDEO_ID_FILM,
                        sd: "assets/ultra/films/film-sd.mp4",
                        hd: "assets/ultra/films/film-hd.mp4",
                        width: 1256,
                        height: 706,
                        controlsOffsetY: 0,
                        hideShare: cuwDic.hide_share
                    });
                }
                return this.$el.append(this.flashVideoView.el);
            }
        };
        FilmPageView.prototype.onStarted = function() {
            if (this.html5VideoView) {
                if (cuw.isSmall()) {
                    return this.html5VideoView.addControls(1500);
                } else {
                    return this.html5VideoView.addControls(1500);
                }
            }
        };
        FilmPageView.prototype.onEnded = function() {
            cuw.tracking.track(cuw.tracking.FILM_END);
            return cuw.appRouter.navigateToPage(cuw.PAGE_INFO);
        };
        FilmPageView.prototype.beforeTransition = function(isCurrent_) {
            if (this.html5VideoView) {
                this.html5VideoView.pause();
            }
            if (this.flashVideoView) {
                return this.flashVideoView.pause();
            }
        };
        FilmPageView.prototype.afterTransition = function(isCurrent_) {
            if (isCurrent_) {
                if (this.html5VideoView) {
                    this.html5VideoView.play();
                }
                if (this.flashVideoView) {
                    this.flashVideoView.play();
                }
                return cuw.tracking.track(cuw.tracking.FILM_START);
            }
        };
        return FilmPageView;
    }(AbstractPageView);
    HomePageView = function(_super) {
        __extends(HomePageView, _super);
        function HomePageView() {
            this.onClick = __bind(this.onClick, this);
            return HomePageView.__super__.constructor.apply(this, arguments);
        }
        HomePageView.prototype.hasTransition = false;
        HomePageView.prototype.events = {
            "click #cuw-page-home-button": "onClick"
        };
        HomePageView.prototype.init = function() {};
        HomePageView.prototype.onClick = function(e_) {
            e_.preventDefault();
            cuw.playFilm();
            cuw.tracking.track(cuw.tracking.WATCH_CLICK);
            return cuw.appRouter.navigateToPage(cuw.PAGE_FILM);
        };
        return HomePageView;
    }(AbstractPageView);
    InfoPageView = function(_super) {
        __extends(InfoPageView, _super);
        function InfoPageView() {
            this.onArrowDown = __bind(this.onArrowDown, this);
            this.onArrowUp = __bind(this.onArrowUp, this);
            this.onSwitchOff = __bind(this.onSwitchOff, this);
            this.onSwitchOn = __bind(this.onSwitchOn, this);
            this.onAfter = __bind(this.onAfter, this);
            this.onBefore = __bind(this.onBefore, this);
            return InfoPageView.__super__.constructor.apply(this, arguments);
        }
        InfoPageView.prototype.hasTransition = false;
        InfoPageView.prototype.$innerEl = null;
        InfoPageView.prototype.currSlide = 0;
        InfoPageView.prototype.allowClick = true;
        InfoPageView.prototype.init = function() {
            var textBloc, _i, _len, _ref, _results;
            this.$innerEl = this.$("#cuw-page-info-text", this.$el);
            this.$innerEl.cycle({
                fx: "scrollHorz",
                easing: "easeInOutSine",
                speed: 700,
                timeout: 0,
                before: this.onBefore,
                after: this.onAfter,
                startingSlide: this.currSlide
            });
            this.$("#switch-on", this.$el).click(this.onSwitchOn);
            this.$("#switch-off", this.$el).click(this.onSwitchOff);
            _ref = this.$(".cuw-page-info-text-inner-copy", this.$el);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                textBloc = _ref[_i];
                if (this.hasScrollBar(textBloc)) {
                    if (cuwDic.is_mobile || cuwDic.is_tablet) {
                        this.$(textBloc).css("overflow-y", "scroll");
                        if (cuw.isSmall()) {
                            this.$(textBloc).css("height", "240px");
                        }
                    }
                    this.$(".arrow-up", this.$(textBloc).parent()).click(this.onArrowUp);
                    _results.push(this.$(".arrow-down", this.$(textBloc).parent()).click(this.onArrowDown));
                } else {
                    this.$(".arrow-up", this.$(textBloc).parent()).remove();
                    _results.push(this.$(".arrow-down", this.$(textBloc).parent()).remove());
                }
            }
            return _results;
        };
        InfoPageView.prototype.hasScrollBar = function($target) {
            var value;
            value = false;
            if ($target.clientHeight < $target.scrollHeight) {
                value = true;
            }
            return value;
        };
        InfoPageView.prototype.onBefore = function(curr_, next_, opts_) {
            return this.allowClick = false;
        };
        InfoPageView.prototype.onAfter = function(curr_, next_, opts_) {
            this.currSlide = opts_.currSlide;
            return this.allowClick = true;
        };
        InfoPageView.prototype.onSwitchOn = function(e_) {
            e_.preventDefault();
            if (this.allowClick) {
                return this["switch"](true);
            }
        };
        InfoPageView.prototype.onSwitchOff = function(e_) {
            e_.preventDefault();
            if (this.allowClick) {
                return this["switch"](false);
            }
        };
        InfoPageView.prototype["switch"] = function(value_) {
            if (value_) {
                this.$innerEl.cycle(1);
                cuw.bgView.change(cuw.BG_INFO2);
                return cuw.tracking.track(cuw.tracking.PAGE_INFO_CAMPAIGN_VIEW);
            } else {
                this.$innerEl.cycle(0);
                cuw.bgView.change(cuw.BG_INFO1);
                return cuw.tracking.track(cuw.tracking.PAGE_INFO_STYLE_VIEW);
            }
        };
        InfoPageView.prototype.beforeTransition = function(isCurrent_) {
            if (isCurrent_) {
                return this.$innerEl.cycle(0);
            }
        };
        InfoPageView.prototype.onArrowUp = function(e_) {
            var $target, target, time, y;
            e_.preventDefault();
            target = this.$(".cuw-page-info-text-inner-copy", this.$(e_.currentTarget).parent())[0];
            $target = this.$(target);
            y = $target.scrollTop() - 250;
            if (y < 0) {
                y = 0;
            }
            time = $target.scrollTop() - y;
            return $target.stop().animate({
                scrollTop: y
            }, {
                duration: time,
                easing: "linear"
            });
        };
        InfoPageView.prototype.onArrowDown = function(e_) {
            var $target, target, time, y;
            e_.preventDefault();
            target = this.$(".cuw-page-info-text-inner-copy", this.$(e_.currentTarget).parent())[0];
            $target = this.$(target);
            y = $target.scrollTop() + 250;
            if (y > target.scrollHeight - target.clientHeight) {
                y = target.scrollHeight - target.clientHeight;
            }
            time = y - $target.scrollTop();
            return $target.stop().animate({
                scrollTop: y
            }, {
                duration: time,
                easing: "linear"
            });
        };
        return InfoPageView;
    }(AbstractPageView);
    PageContainerView = function(_super) {
        __extends(PageContainerView, _super);
        function PageContainerView() {
            this.onAfter = __bind(this.onAfter, this);
            this.onBefore = __bind(this.onBefore, this);
            return PageContainerView.__super__.constructor.apply(this, arguments);
        }
        PageContainerView.prototype.EVENT_TRANSITION_STARTED = "EVENT_TRANSITION_STARTED";
        PageContainerView.prototype.EVENT_TRANSITION_FINISHED = "EVENT_TRANSITION_FINISHED";
        PageContainerView.prototype.id = "cuw-page-container";
        PageContainerView.prototype.hasTransition = false;
        PageContainerView.prototype.currentIndex = 0;
        PageContainerView.prototype.currentId = "";
        PageContainerView.prototype.listArray = [];
        PageContainerView.prototype.listDic = {};
        PageContainerView.prototype.init = function() {
            this.render();
            return this.start();
        };
        PageContainerView.prototype.render = function() {
            var itemModel, itemView, pageEl, pageElArray, sameId, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
            _ref = cuw.pageCollection.models;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                itemModel = _ref[_i];
                this.appendItem(itemModel);
            }
            pageElArray = this.$(".page");
            for (_j = 0, _len1 = pageElArray.length; _j < _len1; _j++) {
                pageEl = pageElArray[_j];
                sameId = false;
                _ref1 = this.listArray;
                for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                    itemView = _ref1[_k];
                    if (itemView.id === this.$(pageEl).attr("id")) {
                        sameId = true;
                    }
                }
                if (!sameId) {
                    this.$(pageEl).remove();
                }
            }
            return this;
        };
        PageContainerView.prototype.appendItem = function(model_) {
            var id, itemView, viewId;
            id = model_.get("id");
            viewId = "cuw-page-" + id;
            switch (id) {
              case cuw.PAGE_INTRO:
                itemView = new IntroPageView({
                    id: viewId,
                    model: model_
                });
                break;

              case cuw.PAGE_HOME:
                itemView = new HomePageView({
                    id: viewId,
                    model: model_
                });
                break;

              case cuw.PAGE_FILM:
                itemView = new FilmPageView({
                    id: viewId,
                    model: model_
                });
                break;

              case cuw.PAGE_INFO:
                itemView = new InfoPageView({
                    id: viewId,
                    model: model_
                });
                break;

              case cuw.PAGE_DOWNLOADS:
                itemView = new DownloadsPageView({
                    id: viewId,
                    model: model_
                });
                break;

              case cuw.PAGE_SHARE:
                itemView = new SharePageView({
                    id: viewId,
                    model: model_
                });
            }
            this.listArray.push(itemView);
            this.listDic[id] = itemView;
            return this.$el.append(itemView.render().el);
        };
        PageContainerView.prototype.start = function() {
            var i, l;
            this.currentId = cuw.PAGE_DEFAULT;
            i = 0;
            l = cuw.pageCollection.length;
            while (i < l) {
                if (cuw.pageCollection.at(i).get("id") === this.currentId) {
                    this.currentIndex = i;
                    i = l;
                }
                i++;
            }
            this.$el.cycle({
                sync: 0,
                fx: "fade",
                easeIn: "easeInOutSine",
                easeOut: "easeInOutSine",
                speedIn: 1e3,
                speedOut: 500,
                timeout: 0,
                before: this.onBefore,
                after: this.onAfter,
                startingSlide: this.currentIndex,
                cleartype: true,
                cleartypeNoBg: true
            });
            return this.onAfter(null, null, {
                currSlide: this.currentIndex
            });
        };
        PageContainerView.prototype.onBefore = function(curr_, next_, opts_) {
            var itemView, _i, _len, _ref;
            _ref = this.listArray;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                itemView = _ref[_i];
                if (itemView === this.listArray[this.currentIndex]) {
                    itemView.beforeTransition(true);
                } else {
                    itemView.beforeTransition(false);
                }
            }
            return this.trigger(this.EVENT_TRANSITION_STARTED);
        };
        PageContainerView.prototype.onAfter = function(curr_, next_, opts_) {
            var itemView;
            this.currentIndex = opts_.currSlide;
            itemView = this.listArray[this.currentIndex];
            if (itemView && itemView.pageId() === this.currentId) {
                itemView.afterTransition(true);
            }
            return this.trigger(this.EVENT_TRANSITION_FINISHED);
        };
        PageContainerView.prototype.change = function(id_) {
            var i, l;
            if (this.currentId === id_) {
                return;
            }
            this.currentId = id_;
            i = 0;
            l = cuw.pageCollection.length;
            while (i < l) {
                if (cuw.pageCollection.at(i).get("id") === this.currentId) {
                    this.currentIndex = i;
                    this.$el.cycle(this.currentIndex);
                    return;
                }
                i++;
            }
        };
        return PageContainerView;
    }(AbstractView);
    SharePageView = function(_super) {
        __extends(SharePageView, _super);
        function SharePageView() {
            return SharePageView.__super__.constructor.apply(this, arguments);
        }
        SharePageView.prototype.hasTransition = false;
        SharePageView.prototype.init = function() {
            return this;
        };
        SharePageView.prototype.beforeTransition = function(isCurrent_) {
            return this;
        };
        SharePageView.prototype.afterTransition = function(isCurrent_) {
            if (isCurrent_) {
                return cuw.appShare.shareMail(false);
            }
        };
        return SharePageView;
    }(AbstractPageView);
    window.CUWApp = function() {
        CUWApp.prototype.$ = jQuery;
        CUWApp.prototype.currentPageId = null;
        CUWApp.prototype.currentBgId = null;
        CUWApp.prototype.prevPageId = null;
        CUWApp.prototype.prevBgId = null;
        CUWApp.prototype.hasStartedFilm = false;
        CUWApp.prototype.RES_BIG = "Big";
        CUWApp.prototype.RES_SMALL = "Small";
        CUWApp.prototype.BG_BLACK = "black";
        CUWApp.prototype.BG_HOME = "home";
        CUWApp.prototype.BG_INFO1 = "info1";
        CUWApp.prototype.BG_INFO2 = "info2";
        CUWApp.prototype.BG_DOWNLOADS = "downloads";
        CUWApp.prototype.PAGE_HOME = "home";
        CUWApp.prototype.PAGE_FILM = "film";
        CUWApp.prototype.PAGE_INFO = "info";
        CUWApp.prototype.PAGE_DOWNLOADS = "downloads";
        CUWApp.prototype.PAGE_SHARE = "share";
        CUWApp.prototype.PAGE_DEFAULT = null;
        CUWApp.prototype.VIDEO_ID_FILM = "cuw-page-film-video";
        CUWApp.prototype.appRouter = null;
        CUWApp.prototype.bgCollection = null;
        CUWApp.prototype.pageCollection = null;
        CUWApp.prototype.downloadCollection = null;
        CUWApp.prototype.logoView = null;
        CUWApp.prototype.bgView = null;
        CUWApp.prototype.pageContainerView = null;
        CUWApp.prototype.introView = null;
        CUWApp.prototype.headerView = null;
        CUWApp.prototype.footerView = null;
        CUWApp.prototype.mouseWatcher = null;
        CUWApp.prototype.appShare = null;
        CUWApp.prototype.tracking = null;
        function CUWApp() {
            this.onMouseInactivated = __bind(this.onMouseInactivated, this);
            this.onMouseActivated = __bind(this.onMouseActivated, this);
            this.onTransitionFinished = __bind(this.onTransitionFinished, this);
            this.onTransitionStarted = __bind(this.onTransitionStarted, this);
            this.onHashChanged = __bind(this.onHashChanged, this);
            this.bgCollection = new BgCollection(this.getBgArray());
            this.pageCollection = new PageCollection(this.getPageArray());
            this.downloadCollection = new DownloadCollection(this.getDownloadArray());
        }
        CUWApp.prototype.getBgArray = function() {
            var postfix;
            if (this.isSmall()) {
                postfix = "small";
            } else {
                postfix = "big";
            }
            return [ {
                id: this.BG_BLACK,
                image: cuwDic.assets_base_path + "assets/ultra/bg/black-" + postfix + ".gif"
            }, {
                id: this.BG_HOME,
                image: cuwDic.assets_base_path + "assets/ultra/bg/home-" + postfix + ".jpg"
            }, {
                id: this.BG_INFO1,
                image: cuwDic.assets_base_path + "assets/ultra/bg/info1-" + postfix + ".jpg"
            }, {
                id: this.BG_INFO2,
                image: cuwDic.assets_base_path + "assets/ultra/bg/info2-" + postfix + ".jpg"
            }, {
                id: this.BG_DOWNLOADS,
                image: cuwDic.assets_base_path + "assets/ultra/bg/downloads-" + postfix + ".jpg"
            } ];
        };
        CUWApp.prototype.getPageArray = function() {
            console.log(cuwDic.nav_downloads);
            return [ {
                id: this.PAGE_HOME,
                bgId: this.BG_HOME,
                hideInNav: true
            }, {
                id: this.PAGE_FILM,
                bgId: this.BG_BLACK,
                label: cuwDic.nav_film
            }, {
                id: this.PAGE_INFO,
                bgId: this.BG_INFO1,
                label: cuwDic.nav_info
            }, {
                id: this.PAGE_DOWNLOADS,
                bgId: this.BG_DOWNLOADS,
                label: cuwDic.nav_downloads
            }, {
                id: this.PAGE_SHARE,
                bgId: this.BG_BLACK,
                hideInNav: true
            } ];
        };
        CUWApp.prototype.getDownloadArray = function() {
            var array;
            array = [];
            array.push({
                label: cuwDic.wallpapers,
                itemCollection: new DownloadItemCollection(this.getWallpaperArray())
            });
            if (this.isDesktop()) {
                array.push({
                    label: cuwDic.screensavers,
                    itemCollection: new DownloadItemCollection(this.getScreensaverArray())
                });
            }
            return array;
        };
        CUWApp.prototype.getScreensaverArray = function() {
            return [ {
                label: cuwDic.download,
                thumbnail: cuwDic.assets_base_path + "assets/ultra/download/screensaver1.jpg",
                typeCollection: new DownloadItemTypeCollection(this.getScreensaverTypeArray(1))
            } ];
        };
        CUWApp.prototype.getScreensaverTypeArray = function(id_) {
            var file, text;
            switch (ch_lang) {
              case "fr":
                text = "joaillerie";
                break;

              case "en-gb":
                text = "jewellery";
                break;

              default:
                text = "jewelry";
            }
            file = "chanel_" + text + "_";
            return [ {
                label: cuwDic.screensaver_mac,
                url: cuwDic.assets_base_path + "assets/ultra/screensavers/" + file + "mac.zip",
                isWallpaper: false,
                isMac: true
            }, {
                label: cuwDic.screensaver_pc,
                url: cuwDic.assets_base_path + "assets/ultra/screensavers/" + file + "pc.zip",
                isWallpaper: false,
                isMac: false
            } ];
        };
        CUWApp.prototype.getWallpaperArray = function() {
            if (this.isDesktop()) {
                return [ /* {
                     label: cuwDic.download,
                     thumbnail: cuwDic.assets_base_path + 'assets/ultra/download/wallpaper1.jpg',
                     typeCollection: new DownloadItemTypeCollection(this.getWallpaperTypeArray(1))
                     },*/
                {
                    label: cuwDic.download,
                    thumbnail: cuwDic.assets_base_path + "assets/ultra/download/wallpaper2.jpg",
                    typeCollection: new DownloadItemTypeCollection(this.getWallpaperTypeArray(2))
                }, {
                    label: cuwDic.download,
                    thumbnail: cuwDic.assets_base_path + "assets/ultra/download/wallpaper3.jpg",
                    typeCollection: new DownloadItemTypeCollection(this.getWallpaperTypeArray(3))
                }, {
                    label: cuwDic.download,
                    thumbnail: cuwDic.assets_base_path + "assets/ultra/download/wallpaper4.jpg",
                    typeCollection: new DownloadItemTypeCollection(this.getWallpaperTypeArray(4))
                } ];
            } else {
                return [ {
                    label: cuwDic.download,
                    thumbnail: cuwDic.assets_base_path + "assets/ultra/download/wallpaper1.jpg",
                    typeCollection: new DownloadItemTypeCollection(this.getWallpaperTypeArray(1))
                }, {
                    label: cuwDic.download,
                    thumbnail: cuwDic.assets_base_path + "assets/ultra/download/wallpaper3.jpg",
                    typeCollection: new DownloadItemTypeCollection(this.getWallpaperTypeArray(3))
                } ];
            }
        };
        CUWApp.prototype.getWallpaperTypeArray = function(id_) {
            var file, text;
            switch (ch_lang) {
              case "fr":
                text = "joaillerie";
                break;

              case "en-gb":
                text = "jewellery";
                break;

              default:
                text = "jewelry";
            }
            file = id_ + "_" + text + "_";
            if (this.isDesktop()) {
                return [ {
                    label: cuwDic.wallpaper_1024x768,
                    url: cuwDic.assets_base_path + "assets/ultra/download/" + file + "768p.jpg",
                    isWallpaper: true,
                    isDesktop: true
                }, {
                    label: cuwDic.wallpaper_1280x720,
                    url: cuwDic.assets_base_path + "assets/ultra/download/" + file + "720p.jpg",
                    isWallpaper: true,
                    isDesktop: true
                } ];
            } else {
                return [ {
                    label: cuwDic.wallpaper_tablet,
                    url: cuwDic.assets_base_path + "assets/ultra/download/" + file + "720p.jpg",
                    isWallpaper: true,
                    isDesktop: false
                } ];
            }
        };
        CUWApp.prototype.initialize = function() {
            this.tracking = new Tracking();
            if (cuwDic.deep_link_to_film) {
                this.PAGE_DEFAULT = this.PAGE_FILM;
            } else {
                this.PAGE_DEFAULT = this.PAGE_HOME;
            }
            this.logoView = new LogoView();
            this.bgView = new BgView();
            this.pageContainerView = new PageContainerView();
            this.pageContainerView.on(this.pageContainerView.EVENT_TRANSITION_STARTED, this.onTransitionStarted);
            this.pageContainerView.on(this.pageContainerView.EVENT_TRANSITION_FINISHED, this.onTransitionFinished);
            if (!cuwDic.deep_link_to_film) {
                this.introView = new IntroView();
            }
            this.headerView = new HeaderView();
            this.footerView = new FooterView();
            if (this.isDesktop()) {
                this.mouseWatcher = new MouseWatcher();
                this.$(this.mouseWatcher).bind("mouse_active", this.onMouseActivated);
                this.$(this.mouseWatcher).bind("mouse_inactive", this.onMouseInactivated);
            }
            this.appShare = new Share();
            this.appRouter = new AppRouter();
            this.appRouter.on(this.appRouter.EVENT_HASH_CHANGED, this.onHashChanged);
            return this.appRouter.start(this.PAGE_DEFAULT);
        };
        CUWApp.prototype.startIntro = function() {
            if (this.introView) {
                return this.introView.start();
            }
        };
        CUWApp.prototype.isSmall = function() {
            if (WFJ.resVersion === this.RES_SMALL) {
                return true;
            } else {
                return false;
            }
        };
        CUWApp.prototype.isDesktop = function() {
            if (cuwDic.is_mobile || cuwDic.is_tablet) {
                return false;
            } else {
                return true;
            }
        };
        CUWApp.prototype.isHTML5Video = function() {
            if (!swfobject.getFlashPlayerVersion().major || !this.isDesktop()) {
                return true;
            } else {
                return false;
            }
        };
        CUWApp.prototype["return"] = function() {
            if (this.prevPageId) {
                return this.appRouter.navigateToPage(this.prevPageId);
            }
        };
        CUWApp.prototype.onHashChanged = function(id_) {
            var bgId;
            bgId = this.pageCollection.get(id_).get("bgId");
            if (this.currentPageId !== id_) {
                this.prevPageId = this.currentPageId;
                this.currentPageId = id_;
                this.pageContainerView.change(this.currentPageId);
                this.footerView.change(this.currentPageId);
                this.closePopup();
                if (this.currentPageId === this.PAGE_FILM) {
                    this.headerView.$backEl.fadeOut("medium");
                } else {
                    this.headerView.$backEl.fadeIn("medium");
                    this.pauseFilm();
                }
                if (this.currentPageId === this.PAGE_SHARE) {
                    this.headerView.allowRollOver = false;
                    this.headerView.showIcons();
                } else {
                    this.headerView.allowRollOver = true;
                    this.headerView.hideIcons();
                }
                if (this.mouseWatcher) {
                    if (this.currentPageId === this.PAGE_FILM) {
                        this.mouseWatcher.active();
                    } else {
                        this.mouseWatcher.deactive();
                    }
                } else {
                    if (this.currentPageId === this.PAGE_FILM) {
                        this.logoView.$el.fadeOut("medium");
                    } else {
                        this.logoView.$el.fadeIn("medium");
                    }
                }
                if (this.currentPageId === this.PAGE_INFO) {
                    $("#logo_chanel_joaillerie_black").fadeIn(1);
                    $("#logo_chanel_joaillerie").fadeOut(1);
                } else {
                    $("#logo_chanel_joaillerie_black").fadeOut(1);
                    $("#logo_chanel_joaillerie").fadeIn(1);
                }
                this.tracking.trackPageView();
            }
            if (this.currentBgId !== bgId) {
                this.prevBgId = this.currentBgId;
                this.currentBgId = bgId;
                return this.bgView.change(this.currentBgId);
            }
        };
        CUWApp.prototype.onTransitionStarted = function() {
            return this.footerView.navView.allowClick(false);
        };
        CUWApp.prototype.onTransitionFinished = function() {
            return this.footerView.navView.allowClick(true);
        };
        CUWApp.prototype.onMouseActivated = function() {
            this.logoView.$el.fadeIn("medium");
            this.headerView.$el.fadeIn("medium");
            this.footerView.$el.fadeIn("medium");
            if (this.getVideoSwf() && this.getVideoSwf().onMouseActivated) {
                return this.getVideoSwf().onMouseActivated();
            }
        };
        CUWApp.prototype.onMouseInactivated = function() {
            this.logoView.$el.fadeOut("medium");
            this.headerView.$el.fadeOut("medium");
            this.footerView.$el.fadeOut("medium");
            if (this.getVideoSwf() && this.getVideoSwf().onMouseInactivated) {
                return this.getVideoSwf().onMouseInactivated();
            }
        };
        CUWApp.prototype.getVideoSwf = function() {
            return document.getElementById(this.VIDEO_ID_FILM) || window[this.VIDEO_ID_FILM] || document[this.VIDEO_ID_FILM];
        };
        CUWApp.prototype.playFilm = function() {
            if (this.isHTML5Video() && !this.hasStartedFilm) {
                this.hasStartedFilm = true;
                return document.getElementById(this.VIDEO_ID_FILM).play();
            }
        };
        CUWApp.prototype.pauseFilm = function() {
            if (this.isHTML5Video()) {
                return document.getElementById(this.VIDEO_ID_FILM).pause();
            } else if (this.getVideoSwf() && this.getVideoSwf().pauseVideo) {
                return this.getVideoSwf().pauseVideo();
            }
        };
        CUWApp.prototype.onFlashFilmEnded = function() {
            this.tracking.track(this.tracking.FILM_END);
            return this.appRouter.navigateToPage(this.PAGE_INFO);
        };
        CUWApp.prototype.onFlashFilmFacebook = function() {
            return this.appShare.shareSocial("facebook", true);
        };
        CUWApp.prototype.onFlashFilmTwitter = function() {
            return this.appShare.shareSocial("twitter", true);
        };
        CUWApp.prototype.onFlashFilmWeibo = function() {
            return this.appShare.shareSocial("weibo", true);
        };
        CUWApp.prototype.onFlashFilmKaixin = function() {
            return this.appShare.shareSocial("kaixin", true);
        };
        CUWApp.prototype.onFlashFilmRenren = function() {
            return this.appShare.shareSocial("renren", true);
        };
        CUWApp.prototype.onFlashFilmMixi = function() {
            return this.appShare.shareSocial("mixi", true);
        };
        CUWApp.prototype.onFlashFilmEmail = function() {
            return this.appShare.shareMail(true);
        };
        CUWApp.prototype.onFlashFilmEmbeded = function() {
            return this.appShare.shareBlog(cuwDic.embed_video_url);
        };
        CUWApp.prototype.popupOpenComplete = function() {
            if (this.mouseWatcher) {
                this.mouseWatcher.deactive();
            }
            return jQuery("#popin").hide().fadeIn("fast");
        };
        CUWApp.prototype.closePopup = function(andPlay_) {
            if (andPlay_ == null) {
                andPlay_ = false;
            }
            this.$("#popin").html("");
            this.$("#popin").removeAttr("class");
            this.$("#inline_popup").css("display", "none");
            if (this.mouseWatcher) {
                if (this.currentPageId === this.PAGE_FILM) {
                    this.mouseWatcher.active();
                } else {
                    this.mouseWatcher.deactive();
                }
            }
            if (andPlay_ && this.getVideoSwf() && this.getVideoSwf().playVideo) {
                return this.getVideoSwf().playVideo();
            }
        };
        return CUWApp;
    }();
    if (!window["console"]) {
        window.console = {};
        console.log = function(e_) {
            return e_;
        };
        console.dir = console.log;
    }
}).call(this);

function goToLinkAlias() {
    WFJ.goToLink();
}

var urlToLoad = "";

var waitForWebtrends = function(url) {
    urlToLoad = url;
    setTimeout(launchLink, 500);
};

var launchLink = function() {
    document.location.href = urlToLoad;
};

function stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, ch_scat2, ch_prod, dl, pn_sku, tx_e, feature, nv, nv_action) {
    var DEBUG = false;
    if (dcs) {
        dcs.WT.dl = dl;
        dcs.DCSext.ch_re = ch_re;
        dcs.DCSext.ch_lang = ch_lang;
        dcs.WT.cg_n = cg_n;
        dcs.WT.cg_s = cg_s;
        dcs.DCSext.ch_div = ch_div;
        dcs.DCSext.ch_cat = ch_cat;
        dcs.DCSext.ch_scat1 = ch_scat1;
        dcs.DCSext.ch_scat2 = ch_scat2;
        dcs.DCSext.ch_prod = ch_prod;
        dcs.WT.pn_sku = pn_sku;
        dcs.WT.tx_e = tx_e;
        dcs.WT.clip_n = "";
        dcs.WT.clip_ev = "";
        dcs.DCSext.feature = feature;
        dcs.WT.nv = nv;
        dcs.DCSext.nv_action = nv_action;
        dcs.WT.pn_sku_de = "";
        dcs.WT.z_collection = "";
        dcs.WT.z_sous_collection = "";
        dcs.WT.z_categorie = "";
        dcs.WT.tx_u = "";
        dcs.track();
    }
    /*if (DEBUG) {
        console.log('=========================');
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log('!! DEBUG TAG WEBTRENDS !!');
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log('=========================');
        for (var attr in data) {
            console.log(':: ' + attr + ' :: ');
            console.log(data[attr]);
            console.log('_________________________');
        }
        console.log('=========================');
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log('=========================');
    }*/
    //dcsMultiTrack("DCSext.ch_re", ch_re, "DCSext.ch_lang", ch_lang, "WT.cg_n", cg_n, "WT.cg_s", cg_s, "DCSext.ch_div", ch_div, "DCSext.ch_cat", ch_cat, "DCSext.ch_scat1", ch_scat1, "DCSext.ch_scat2", ch_scat2, "DCSext.ch_prod", ch_prod, "WT.dl", dl, "WT.pn_sku", pn_sku, "WT.tx_e", tx_e, "WT.clip_n", '', "WT.clip_ev", '');
    if (ch_lang == "fr") {
        if (ch_scat2 == "W Register link" && ch_cat == "Fine Jewelry") {
            trackingCode("129257");
        }
        if (ch_scat2 == "W Register link" && ch_cat == "Watches") {
            trackingCode("128440");
        }
        if (ch_scat1 == "W Main Homepage") {
            trackingCode("128439");
        }
        if (ch_scat1 == "FJ Main Homepage") {
            trackingCode("129256");
        }
    }
}

function hj_tagging(lang, scat2, chProd, dl) {
    var plateform = "desktop";
    if (isMobileTablet()) {
        plateform = "mobile";
    }
    var scat1 = $("ch_scat1") ? plateform + "-" + $("ch_scat1").value : plateform;
    stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, scat1, scat2, chProd, dl);
}

function trackingCode(idTrack) {
    try {
        var oScript = document.createElement("SCRIPT");
        var ebRand = Math.random() + " ";
        ebRand = ebRand * 1e6;
        var conversionURL = "HTTP://bs.serving-sys.com/BurstingPipe/ActivityServer.bs?cn=as&ActivityID=" + idTrack + "&rnd=" + ebRand;
        oScript.src = conversionURL;
        document.body.appendChild(oScript);
    } catch (e) {}
}

function openwin(name, myname, mywidth, myheight, mytool, mydir, mystatus, myscroll, myresize, mymenu) {
    var mytop = Math.floor(screen.height / 2 - myheight / 2);
    var myleft = Math.floor(screen.width / 2 - mywidth / 2);
    var debute = window.open(name, myname, "toolbar=" + mytool + ",width=" + mywidth + ",height=" + myheight + ",directories=" + mydir + ",status=" + mystatus + ",scrollbars=" + myscroll + ",top=" + mytop + ",left=" + myleft + ",resizable=" + myresize + ",menubar=" + mymenu);
}

function ShowPopupLegal(strLegalURL) {
    openwin(strLegalURL, "legal", 900, 500, 0, 0, 0, 1, 0, 0);
}

// Fonction Stat2 
function stats_home(arg1, arg2) {
    if (arg1 == "HJ") {
        if (arg2 == "a") {
            var type = "FJ Discover Haute Joaillerie quick link";
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, $("#ch_scat1").val(), type, $("#ch_prod").val(), 50);
        } else {
            var type = "FJ Discover Baroque quick link";
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, $("#ch_scat1").val(), type, $("#ch_prod").val(), 50);
        }
    }
    if (arg1 == "HH ") {
        if (arg2 == "a") {
            type = "W Discover J12 quick link";
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, $("#ch_scat1").val(), type, $("#ch_prod").val(), 50);
        } else if (arg2 == "b") {
            type = "W Discover première quick link";
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, $("#ch_scat1").val(), type, $("#ch_prod").val(), 50);
        } else {
            type = "W Discover J12 CHROMATIC quick link";
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, $("#ch_scat1").val(), type, $("#ch_prod").val(), 50);
        }
    }
}

function formatLocaleNumber(number) {
    if (locale === "ja_JP" || locale === "ko_KR") {
        number = formatNumber(number, ",");
    } else if (locale === "en_US" || locale === "en_GB" || locale === "ru_RU") {
        number = formatNumber(number, " ");
    }
    return number;
}

function formatNumber(number, separator) {
    number = number.toString().split("").reverse().join("").replace(/(\d{3})/g, "$1" + separator).split("").reverse();
    if (number[0] == "," || number[0] == " ") {
        number[0] = "";
    }
    number = number.join("");
    return number;
}

function stats_film(ch_prod_film) {
    if ($("#cg_s").val() != "") {
        cg_s = $("#cg_s").val();
    }
    if ($("#ch_cat").val() != "") {
        ch_cat = $("#ch_cat").val();
    }
    var ch_scat1 = $("#ch_scat1").val();
    var ch_scat2 = $("#ch_scat2").val();
    if (ch_prod_film != "") {
        dcsMultiTrack("DCSext.ch_re", ch_re, "DCSext.ch_lang", ch_lang, "WT.cg_n", cg_n, "WT.cg_s", cg_s, "DCSext.ch_div", ch_div, "DCSext.ch_cat", ch_cat, "DCSext.ch_scat1", ch_scat1, "DCSext.ch_scat2", ch_scat2, "DCSext.ch_prod", ch_scat2 + " video " + ch_prod_film, "WT.dl", 50, "WT.clip_n", ch_scat2, "WT.clip_ev", ch_prod_film);
    } else {
        dcsMultiTrack("DCSext.ch_re", ch_re, "DCSext.ch_lang", ch_lang, "WT.cg_n", cg_n, "WT.cg_s", cg_s, "DCSext.ch_div", ch_div, "DCSext.ch_cat", ch_cat, "DCSext.ch_scat1", ch_scat1, "DCSext.ch_scat2", ch_scat2, "DCSext.ch_prod", ch_scat2 + " video " + ch_prod_film, "WT.dl", 50, "WT.clip_n", "", "WT.clip_ev", "");
    }
}

/**
 * IE detection
 * @returns true / false on IE or IE 6 detection
 * @type Boolean
 */
function isMobileTablet() {
    return DEVICE_TYPE === "mobile" || DEVICE_TYPE === "tablet";
}

function isTablet() {
    return DEVICE_TYPE === "tablet";
}

function isMobile() {
    return DEVICE_TYPE === "mobile";
}

function htmlDecode(value) {
    return $("<div/>").html(value).text();
}

function ie6() {
    var strChUserAgent = navigator.userAgent;
    var intSplitStart = strChUserAgent.indexOf("(", 0);
    var intSplitEnd = strChUserAgent.indexOf(")", 0);
    var strChMid = strChUserAgent.substring(intSplitStart, intSplitEnd);
    if (strChMid.indexOf("MSIE 6") != -1) return true; else return false;
}

function ie7() {
    var strChUserAgent = navigator.userAgent;
    var intSplitStart = strChUserAgent.indexOf("(", 0);
    var intSplitEnd = strChUserAgent.indexOf(")", 0);
    var strChMid = strChUserAgent.substring(intSplitStart, intSplitEnd);
    if (strChMid.indexOf("MSIE 7") != -1) return true; else return false;
}

function ie6png(img) {
    img.style.display = "block";
    var imgName = img.src.toUpperCase();
    if (imgName.substring(imgName.length - 3, imgName.length) == "PNG") {
        var imgID = img.id ? "id='" + img.id + "' " : "";
        var imgClass = img.className ? "class='" + img.className + "' " : "";
        var imgTitle = img.title ? "title='" + img.title + "' " : "title='" + img.alt + "' ";
        var imgStyle = "display:inline-block;" + img.style.cssText;
        if (img.align == "left") imgStyle = "float:left;" + imgStyle;
        if (img.align == "right") imgStyle = "float:right;" + imgStyle;
        var strNewHTML = "<span " + imgID + imgClass + imgTitle + ' style="width:' + img.width + "px; height:" + img.height + "px;" + imgStyle + ";" + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + img.src + "', sizingMethod='image');\"></span>";
        img.outerHTML = strNewHTML;
    }
    return;
}

function openSharePuzzle() {
    $.ajax({
        type: "GET",
        url: basehref + siteloc + "?page=popin_puzzle_partager&ajaxoutput=true",
        data: {
            collection: $("#collectionRef").val(),
            category: $("#categoryRef").val()
        },
        success: function(result) {
            $("#popin").html(result).removeClass().addClass("partagerPopin");
            $("#inline_popup").show();
        },
        complete: function(result) {
            $("#closePopinBtn").bind("click", function(e) {
                e.preventDefault();
                $("#inline_popup").hide();
            });
            WFJ.getDataController(false);
        }
    });
    return false;
}

function gotoAjax(arg) {
    location.href = basehref + siteloc + arg;
    return false;
}

function gotoBlank(arg) {
    openwin(arg, "legal", 1024, 700, 0, 0, 0, 1, 0, 0);
}

function prefixeSlideNumber(index) {
    var prefixe = "";
    if (index < 9) {
        prefixe = "0";
    }
    return prefixe;
}

function ClosePuzzle() {
    $("#inline_popup").hide();
}

function getStats(arg, type) {
    stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, $("#ch_scat1").val(), $("#ch_scat1").val() + " Universe link", "", 50);
    if (type == 0) {
        WFJ.goToLink(arg);
    } else if (type == 2) {
        location.href = arg;
    } else {
        window.open(arg, "");
    }
    return false;
}

function shareMail(elmtFlash) {
    var $loader = $("#chargement");
    $(elmtFlash).pauseVideo();
    $loader.show();
    $.ajax({
        type: "GET",
        url: encodeURI(basehref + siteloc + "?page=popin_mediaplayer_partager&ajaxoutput=true"),
        data: {
            collection: $("#level1").val(),
            category: $("#level2").val()
        },
        success: function(result) {
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, $("#ch_scat1").val(), $("#ch_scat2").val(), $("#ch_scat2").val() + " Film email link", 50);
            $("#popin").html(result).removeClass().addClass("partagerPopin");
            $("#inline_popup").show();
            $loader.hide();
        },
        complete: function(result) {
            $("#closePopinBtn").bind("click", function(e) {
                e.preventDefault();
                $("#inline_popup").hide();
            });
            WFJ.getDataController(false);
        }
    });
    return false;
}

function shareBlog(urlFLV) {
    $.ajax({
        type: "GET",
        url: encodeURI("/" + sitelocEncoded + "/popin_mediaplayer_integrer"),
        data: {},
        success: function(result) {
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, $("#ch_scat1").val(), $("#ch_scat2").val(), $("#ch_scat2").val() + " Film embed link", 50);
            $("#popin_share_blog").html(result).removeClass().addClass("integrerPopin");
            $("#inline_popup4").show();
        },
        complete: function(result) {
            var playerVersion = 4;
            if (section == "joail") {
                switch (ch_lang) {
                  case "fr":
                    playerVersion = 1;
                    break;

                  case "en-gb":
                  case "en-us":
                    playerVersion = 2;
                    break;

                  default:
                    playerVersion = 3;
                }
            }
            //            $('#popin_share_blog').addClass('integrerPopinShareBlog');
            // REPLACE CODEMEDIA PLACEHOLDERS
            $("#codeMedia").val($("#codeMedia").val().replace("%urlFLV%", urlFLV).replace("%playerVersion%", playerVersion).replace("%logo%", playerVersion));
            // CLICK ON TEXTFIELD
            $("#codeMedia").click(function() {
                this.select();
            });
            // CLOSE POPIN BTN
            $("#closePopinBtnShareBlog").click(function(e) {
                e.preventDefault();
                $("#inline_popup4").hide();
            });
        }
    });
    return false;
}

var timer;

var trackChromatic = {
    landing: "156191",
    univers: "156192",
    H2978: "156193",
    H2978_print: "156194",
    H2979: "156195",
    H2979_print: "156196",
    H2934: "156197",
    H2934_print: "156198",
    H2565: "156199",
    H2565_print: "156200",
    H2566: "156201",
    H2566_print: "156202",
    H2912: "156203",
    H2912_print: "156204",
    H2913: "156205",
    H2913_print: "156206"
};

/* POPIN 3 */
function openPopin3(href) {
    $("#inline_popup3").show();
    $("#contentPopin3").html('<iframe src="' + href + '" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>');
    return false;
}

function closePopin3() {
    $("#inline_popup3").hide();
    $("#contentPopin3").html("");
    return false;
}

function ebConversionTracker(conv) {
    if (ch_lang == "en-us") {
        try {} catch (e) {}
        var ebConversionImg = new Image();
        var ebConversionURL = "HTTP://bs.serving-sys.com/BurstingPipe/ActivityServer.bs?";
        ebConversionURL += "cn=as&ActivityID=" + conv + "&ns=1";
        ebConversionImg.src = ebConversionURL;
    }
}

(function(window) {
    window.console = window.console || {
        log: function(message) {}
    };
})(window);

function UltraBack() {
    window.location.href = sitelocCollectionUltra;
    return false;
}

function update_meta(meta, content) {
    if (meta == "title") {
        document.title = content;
    } else if (meta == "description") {
        $("meta[name=description]").attr("content", content);
    } else if (meta == "keywords") {
        $("meta[name=keywords]").attr("content", content);
    } else {
        $("meta").each(function() {
            if ($(this).attr("property") == meta) {
                $(this).attr("content", content);
            }
        });
    }
}

function collectionDisplayPrices(jsonresponse) {
    var $showPrice = $("#showPrice");
    var $product_price = $("#product_price");
    var $price_mentions = $("#price_mentions");
    var $price_mentions2 = $("#price_mentions2");
    var $products_ref_label = $("#products_ref_label");
    if (typeof jsonresponse.product !== "undefined" && jsonresponse.product.length > 0) {
        // New price interface
        var prices = $products_ref_label.val();
        var priceExist = false;
        var tmp_price = "";
        var noEnterPrice = true;
        var displayPriceMentions = false;
        for (var i = 0, j = jsonresponse.product.length; i < j; i++) {
            var product = jsonresponse.product[i];
            var pos = product.price.indexOf("-1");
            if (product.price && pos >= 0) {
                tmp_price = $product_price.html();
            } else {
                displayPriceMentions = true;
                tmp_price = product.price;
                noEnterPrice = false;
            }
            if (product.ref !== "" && product.diameter && product.diameter.label !== "" && product.price) {
                prices += "<br />" + product.ref + " - " + product.diameter.label + " : " + tmp_price;
                priceExist = true;
            } else if (product.price) {
                prices = tmp_price;
                priceExist = true;
            }
        }
        if (!priceExist) prices = null;
        if (prices !== null) {
            $showPrice.show();
            $product_price.html(prices);
        }
        if (displayPriceMentions) {
            if ($price_mentions2.length && !noEnterPrice) {
                $price_mentions2.show();
                $price_mentions.hide();
            } else {
                $price_mentions.show();
            }
        } else {
            $price_mentions.hide();
            if ($price_mentions2.length) {
                $price_mentions2.hide();
            }
        }
        delete prices, priceExist, tmp_price, noEnterPrice;
    } else {
        // Old price interface
        if (jsonresponse.product && jsonresponse.product.price) {
            pos = jsonresponse.product.price.indexOf("-1");
            if (pos == -1) {
                prices = $products_ref_label.val();
                if (typeof jsonresponse.product.diameter["label"] === "string") {
                    prices += "<br />" + jsonresponse.product.ref + " - " + jsonresponse.product.diameter.label + " : " + jsonresponse.product.price;
                } else {
                    prices = jsonresponse.product.price;
                }
                $product_price.html(prices);
                $showPrice.show();
                if ($price_mentions2.length) {
                    $price_mentions2.show();
                    $price_mentions.hide();
                }
            } else {
                $showPrice.show();
                $price_mentions.hide();
                if ($price_mentions2.length) {
                    $price_mentions.hide();
                    $price_mentions2.show();
                }
            }
        } else {
            $showPrice.hide();
            $price_mentions.show();
            if ($price_mentions2.length) {
                $price_mentions2.hide();
            }
        }
    }
}

function displayVideoPlayer(el, type, controls, iOS) {
    "use strict";
    var i, j, attr, path;
    var $el = $("#" + el);
    // Video container
    var controls = controls ? false : true;
    // Controls video attribute
    var src = {};
    // Sources video/poster
    var flvId = $el.text().toLowerCase();
    // FLV Id to lower case
    var video = null;
    // Video element
    var sources = {};
    // Sources element
    var format = [ "webm", "ogv", "mp4" ];
    // Video formats
    // Create elements video/sources
    video = document.createElement("video");
    video.controls = controls;
    for (i = 0, j = format.length; i < j; i++) {
        attr = format[i];
        switch (type) {
          // Set sources mp4/ogv/webm/jpg
            case "mediaplayer":
            path = path_site + "assets/univers/media/" + flvId + "/" + flvId + ".ext";
            break;

          case "camelia":
            path = flvId.replace(".flv", "") + ".ext";
            break;

          default:
            path = path_site + "assets/whatsnew/media/" + flvId + "/" + flvId + ".ext";
        }
        src[attr] = path.replace(".ext", "." + attr);
        sources[attr] = document.createElement("source");
        sources[attr].src = src[attr];
        // Append sources to video player
        video.appendChild(sources[attr]);
    }
    src.jpg = path.replace(".ext", ".jpg");
    // Set poster
    video.poster = src.jpg;
    //    $el.html(video).find(video).css({width: $el.parent().width() + 'px', height: $el.parent().height() + 'px'}); // Append video to $el and f
    $el.html(video).find(video).css({
        width: "100%",
        height: "100%"
    });
    // Append video to $el and fit it
    // Create controls if not available
    if (!controls) {
        $el.addClass("chanel-video-player");
        $el.append('<div class="chanel-video-bigplay"></div>');
        // Fix for iOS poster
        if (iOS) {
            $el.append('<div id="iOS-poster"><img src="' + src.jpg + '" alt="" /></div>');
        }
    }
    video.load();
    return;
}

function get_num_ecrin() {
    var n = WFJ.ecrin.countEcrin();
    if (n > 0) $("#ecrin_nbitem").html("(" + n + ")"); else $("#ecrin_nbitem").html("");
}

/**
 * html entity decode on String objects
 * @returns String
 */
String.prototype.html_entity_decode = function() {
    var _this = this;
    var code = {
        lt: "<",
        gt: ">"
    };
    return function() {
        for (attr in code) {
            _this = _this.concat().replace(new RegExp("&" + attr + ";", "g"), code[attr]);
        }
        return _this;
    }();
};

/* $ PLUGIN */
(function($) {
    /**
     *	PLUGIN homeSlideShow
     *
     */
    $.fn.homeSlideShow = function(params) {
        var self = $(this), params = $.extend({
            timeout: 500
        }, params), elements = self.children("div"), current = 0, interval = null;
        if (elements.length > 1) setInterval(goNext, params.timeout);
        function goNext() {
            current++;
            if (current >= elements.length) current = 0;
            elements.fadeOut(params.timeout / 5);
            $(elements[current]).delay(params.timeout / 5).fadeIn(params.timeout / 5);
        }
    };
    /**
     *	PLUGIN view360
     *
     */
    $.fn.view360 = function(params) {
        // INIT VARS
        var img = null;
        var current = params.current || 0;
        var vitesse = params.vitesse || 1.5;
        var circleView = params.circleView || true;
        var gyroscopie = params.gyroscopie || false;
        var addWithGyroscopie = 0;
        var self = this;
        var d = "x";
        var $reactZone = $(self).find(".react_zone");
        img = $(self).find("img");
        img.hide();
        $(self).css("background", 'url("' + path_site + '/template/desktop/img/loader_1.gif") top left no-repeat');
        // Affiche après le chargement de la dernière image
        $(self).find("img:last").load(function() {
            // Affiche la premirère frame
            $(self).find("img:first").show();
            var dragstartScrollPane = function(e) {
                params["old" + d] = e.touches[0][d];
            };
            var dragScrollPane = function(e) {
                if (params["old" + d] != null) {
                    var distance = e.touches[0][d] - params["old" + d];
                    var to = distance / (20 * vitesse);
                    if (isMobileTablet()) displayVisuel(to); else displayVisuel(-to);
                }
                params["old" + d] = e.touches[0][d];
            };
            $reactZone.unbind("dragstart", dragstartScrollPane).bind("dragstart", dragstartScrollPane);
            $reactZone.unbind("drag", dragScrollPane).bind("drag", dragScrollPane);
            // Déclaration de l'évènement lié à la gyroscopie
            if (gyroscopie) window.ondevicemotion = moveGyroscopie;
        });
        /**
         * mobile gyroscopie
         *
         * @params : event
         * @return : bool
         */
        function moveGyroscopie(event) {
            var acceleration = {};
            var new_value = null;
            acceleration.offsetX = event.accelerationIncludingGravity.y;
            new_value = Math.round(acceleration.offsetX);
            if (new_value != addWithGyroscopie) {
                addWithGyroscopie = Math.round(acceleration.offsetX);
                displayVisuel(0);
            }
            return true;
        }
        /**
         * gestion de la variable current
         *
         *  @params : data
         *  @return : bool
         */
        function displayVisuel(data) {
            current = current - data;
            if (!circleView) {
                if (current + addWithGyroscopie <= img.length - 1 && current + addWithGyroscopie >= 0) {
                    moveView();
                } else if (current + addWithGyroscopie > img.length - 1) {
                    current = img.length - 1;
                } else if (current + addWithGyroscopie < 0) {
                    current = 0;
                }
            } else {
                if (current + addWithGyroscopie > img.length - 1) {
                    current = 0;
                } else if (current + addWithGyroscopie < 0) {
                    current = img.length - 1;
                }
                moveView();
            }
            return true;
        }
        /**
         *  affiche la frame en cours ( current )
         *
         *  @return : bool
         */
        function moveView() {
            var rel = Math.round(current + addWithGyroscopie);
            $(img).hide();
            $(img[rel]).show();
            return true;
        }
    };
    /**
     *	PLUGIN bandeauSlideshow
     *
     */
    $.fn.bandeauSlideshow = function(params) {
        var params = $.extend({
            speed: 3e3
        }, params);
        $(this).each(function() {
            var BOH = {
                current: 0,
                elements: null,
                interval: null,
                speed: params.speed,
                init: function(selector) {
                    BOH.elements = selector.find("li");
                    $(BOH.elements).css("position", "absolute");
                    BOH.elements.hide();
                    if (BOH.elements.length != 1) {
                        BOH.interval = setInterval(function() {
                            BOH.slide();
                        }, BOH.speed * 2);
                    } else {
                        BOH.slide();
                        return;
                    }
                },
                slide: function() {
                    var params = {
                        speed: BOH.speed / 2,
                        current: BOH.slide.arguments[0] || BOH.current
                    };
                    $(BOH.elements).fadeOut(params.speed);
                    $(BOH.elements[params.current]).delay(params.speed).fadeIn(params.speed);
                    BOH.current = params.current < BOH.elements.length - 1 ? params.current + 1 : 0;
                }
            };
            BOH.init($(this));
        });
    };
    /*
     * SLIDER MEDIA PLAYER GALLERY SETTER
     */
    $.fn.sliderGallery = function(params) {
        var params = $.extend({
            speed: 500
        }, params);
        var $this = $(this);
        $this.each(function(i) {
            var $scrollContent = $(this);
            var $scroll = $scrollContent.parent().find(".scroll");
            var nSlide = $(this).find("li").length;
            $scrollContent.css({
                position: "absolute",
                width: "100%"
            });
            var createSliderFunction = function(event, ui) {
                var n = ~~(100 / nSlide);
                $scroll.css({
                    width: 100 - n + .5 + "%",
                    "padding-right": n + .5 + "%"
                });
                $scroll.find(".ui-slider-handle").width(n + "%");
                $scrollContent.find("li").each(function(i) {
                    $(this).css({
                        position: "absolute",
                        left: i * 100 + "%"
                    });
                });
            };
            var changeSlideFunction = function(event, ui) {
                var n = ~~(100 / nSlide);
                var handlerWidth = Math.round(parseInt($scroll.find(".ui-slider-handle").width()) / $scroll.outerWidth() * 100);
                var handlerLeft = Math.round(parseInt($scroll.find(".ui-slider-handle").css("left")) / $scroll.outerWidth() * 100) / 100;
                // PLACE CURSOR ON RIGHT AT THE LAST SLIDE
                if (ui.value == nSlide - 1 && nSlide - 1 > 0) {
                    $scroll.find(".ui-slider-handle").css("margin-left", -n + "%");
                } else if (ui.value == 0) {
                    $scroll.find(".ui-slider-handle").css("margin-left", "0px");
                } else {
                    $scroll.find(".ui-slider-handle").css("margin-left", -n / 2 + "%");
                }
                $scrollContent.stop().animate({
                    left: -100 * ui.value + "%"
                }, 500);
            };
            var $scrollbar = $scroll.slider({
                min: 0,
                max: nSlide - 1,
                value: 0,
                step: 1,
                slide: changeSlideFunction,
                change: changeSlideFunction,
                create: createSliderFunction
            });
        });
        return $this;
    };
    /*
     * MEDIA PLAYER VIDEO SETTER (HTML / FLASH)
     *
     */
    $.fn.videoMediaPlayer = function(params) {
        var params = $.extend({}, params);
        var $this = $(this);
        $this.each(function(i) {
            // INIT VARS
            var article_id = $this.attr("id") ? $this.attr("id").replace("flashcontent", "") : "";
            var prefix = $("#mediaplayer_articles").length ? "mediaplayer_" : "instants_";
            var color = prefix == "mediaplayer_" ? "0xFFFFFF" : "0x000000";
            var bgcolor = prefix == "mediaplayer_" ? "#000000" : "#FFFFFF";
            var type = prefix === "instants_" ? "instants" : "mediaplayer";
            var value = $(".article.active").attr("id") ? $(".article.active").attr("id").replace("article", "") : "";
            var flvId = $("#flashcontent" + article_id).text().toLowerCase();
            var urlFlv;
            var queryString = window.location.search;
            var imagePreview;
            if (type == "mediaplayer") {
                urlFlv = path_site + "assets/univers/media/" + flvId + "/" + flvId + ".flv";
                imagePreview = path_site + "assets/univers/media/" + flvId + "/" + flvId + ".jpg";
                // fix for articles
                if ($this.parent().attr("id") == "mediaplayer_image") {
                    var color = "0x000000";
                    var bgcolor = "#FFFFFF";
                }
            } else {
                urlFlv = path_site + "assets/whatsnew/media/" + flvId + "/" + flvId + ".flv";
                imagePreview = path_site + "assets/whatsnew/media/" + flvId + "/" + flvId + ".jpg";
            }
            // DISPLAY FLASH PLAYER IF ENABLE
            if (swfobject.getFlashPlayerVersion().major) {
                var params = {
                    quality: "high",
                    scale: "noscale",
                    wmode: "transparent",
                    allowFullScreen: "true",
                    allowscriptaccess: "always",
                    bgcolor: bgcolor
                }, flashvars = {
                    urlflv: urlFlv,
                    color: color,
                    urlimg: imagePreview,
                    lang: sitelocEncoded.split("/")[0]
                }, share_data = {
                    image: "",
                    title: "",
                    descr: ""
                }, attributes = {
                    id: "flashcontent" + article_id,
                    name: "flashcontent" + article_id
                }, data;
                // GET META TAGS FOR SEO AND SHARING / DEFAULT CONTENT
                $("meta").each(function() {
                    if ($(this).attr("property") == "og:image") {
                        share_data.image = $(this).attr("content");
                        share_data.image = basehref.substr(0, basehref.length - 1) + share_data.image;
                    }
                    if ($(this).attr("property") == "og:title") {
                        share_data.title = $(this).attr("content");
                    }
                    if ($(this).attr("property") == "og:description") {
                        share_data.descr = $(this).attr("content");
                    }
                });
                if (document.title != "") share_data.title = document.title;
                if ($("#imagePreview" + value)) {
                    share_data.image = basehref + $("#imagePreview" + value).val();
                }
                // only for mediaplayer
                var query = queryString.replace("univers", "universid");
                var url = $("#shareURL" + value).val() + encodeURIComponent(query);
                data = {
                    url: url,
                    title: $("#title" + value).val(),
                    content: share_data.descr,
                    img: share_data.image,
                    WT_sn_id: "",
                    WT_sn_contentName: "",
                    WT_sn_websiteName: "",
                    WT_sn_sense: "2",
                    locale: locale
                };
                dataTwitter = {
                    url: url,
                    title: $("#title" + value).val(),
                    content: share_data.descr,
                    img: share_data.image,
                    WT_sn_id: "",
                    WT_sn_contentName: "",
                    WT_sn_websiteName: "",
                    WT_sn_sense: "2",
                    locale: locale
                };
                dataFacebook = {
                    url: url,
                    title: $("#title" + value).val(),
                    content: share_data.descr,
                    img: share_data.image,
                    WT_sn_id: "",
                    WT_sn_contentName: "",
                    WT_sn_websiteName: "",
                    WT_sn_sense: "2",
                    locale: locale
                };
                sharing.data.locale = locale;
                // ENABLE ARTICLE DATA TO SHARE CONTENT
                var article_title = $.trim($("#article" + value + " h2").contents().text());
                var article_content = $.trim($("#article" + value + " h2").next().text().substr(0, 250) + "...");
                var twitterText = $.trim($("#twitterText" + value).val().substr(0, 250));
                var facebookText = $.trim($("#facebookText" + value).val());
                data.title = article_title != "" ? article_title : data.title;
                data.content = article_content != "" ? article_content : data.content;
                dataTwitter.title = twitterText != "" ? twitterText : dataTwitter.title;
                dataFacebook.content = facebookText != "" ? facebookText : dataFacebook.content;
                dataFacebook.title = data.title;
                // APPLY CONTENT TO SHARINGS
                switch (ch_lang) {
                  // CHINE
                    case "zh-cn":
                    flashvars.share_kaixin = sharing.setPostData(data, "kaixin").share();
                    flashvars.share_renRen = sharing.setPostData(data, "renren").share();
                    flashvars.share_sina = sharing.setPostData(data, "weibo").share();
                    if ($("#shareText" + value).length) flashvars.share_label = $("#shareText" + value).val();
                    break;

                  // JAP
                    case "jp":
                    flashvars.share_facebook = sharing.setPostData(data, "facebook").share();
                    flashvars.share_twitter = sharing.setPostData(data, "twitter").share();
                    flashvars.share_mixi = sharing.setPostData(data, "mixi").share();
                    if ($("#shareText" + value).length > 0) flashvars.share_label = $("#shareText" + value).val();
                    break;

                  // WORLD
                    default:
                    flashvars.share_facebook = sharing.setPostData(dataFacebook, "facebook").share();
                    flashvars.share_twitter = sharing.setPostData(dataTwitter, "twitter").share();
                    if ($("#shareText" + value).length > 0) flashvars.share_label = $("#shareText" + value).val();
                }
                // DISPLAY PLAYER
                swfobject.embedSWF(path_site + "template/swf/PlayerVideoStream.swf?_=" + ~~(Math.random() * 1e5), "flashcontent" + article_id, "638", "401", "9.0.124", path_site + "template/swf/expressInstall.swf", flashvars, params, attributes);
            } else {
                // DISPLAY HTML5 VIDEO PLAYER IF NO FLASH PLUGIN
                displayVideoPlayer("flashcontent" + article_id, type);
            }
        });
        return $this;
    };
    /*
     * EXPERTISE MODELS VIEW PLUGIN
     *
     */
    $.fn.viewExpertise = function(params) {
        var params = $.extend({
            speed: 500
        }, params);
        var $this = $(this);
        var $controls = $(params.controls).find(".controlBtn");
        var $controlsContainer = $(".controlContainer");
        var $playBtn = $(params.controls).find("#playPauseBtn");
        var state = "play";
        var animeLoader = null;
        var m = {
            changeImgSrc: function(control_id) {
                var $model = $("#model_" + control_id);
                var $control = $("#control_" + control_id);
                var $load = $control.find(".load");
                var $loads = $controls.find(".load");
                $controls.removeClass("current");
                $control.addClass("current");
                // RESET ALL LOADERS
                $loads.stop(true).width(0);
                $this.find("img").stop(true).fadeOut(params.speed, function() {
                    // PREVENT EXCESSIVE SELECTION
                    $loads.stop(true).width(0);
                    animeLoader = $load.delay(params.speed).animate({
                        width: "100%"
                    }, params.speed * 10, function() {
                        m.doNext();
                    });
                    setTimeout(function() {
                        $model.fadeIn(params.speed);
                    }, params.speed);
                });
            },
            doNext: function() {
                var control_id, $control;
                $controls.each(function(i, el) {
                    if ($(this).hasClass("current")) {
                        $control = $(this).parent().next().children(".controlBtn");
                        console.log($(this));
                    }
                });
                if ($control.length == 0) {
                    $control = $controls.first(".controlBtn");
                }
                $control.trigger("click", [ true ]);
            },
            controlsClick: function(e, automatic) {
                e.preventDefault();
                e.stopPropagation();
                m.setPlayState();
                var control_id = $(this).children().attr("id").replace("control_", "");
                if (!automatic) {
                    stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, $("#ch_scat1").val(), $("#ch_scat1").val() + " " + $("#level2").val(), $("#ch_scat1").val() + " " + $("#label").val() + " visual" + control_id + " Click", 50 + parseInt(control_id), $("#product_ref").val());
                }
                m.changeImgSrc(control_id);
            },
            pause: function() {
                animeLoader.stop(false);
            },
            play: function() {
                var timer = 0;
                var width = animeLoader.width() * 100 / animeLoader.parent().width();
                timer = params.speed * 10 - width / 100 * (params.speed * 10);
                animeLoader.animate({
                    width: "100%"
                }, timer, function() {
                    m.doNext();
                });
            },
            playClick: function() {
                if (state == "play") {
                    m.pause();
                    m.setPauseState();
                } else if (state == "pause") {
                    m.play();
                    m.setPlayState();
                }
            },
            setPlayState: function() {
                $playBtn.removeClass();
                $playBtn.addClass("pauseBtn");
                state = "play";
            },
            setPauseState: function() {
                $playBtn.removeClass();
                $playBtn.addClass("playBtn");
                state = "pause";
            },
            autoStart: function() {
                if ($this.find("img").length > 1) {
                    $this.find("img").hide();
                    $controls.first().trigger("click");
                } else {
                    $this.find("img").show();
                }
            }
        };
        // SET EVENTS
        $controlsContainer.unbind("click", m.controlsClick).bind("click", m.controlsClick);
        $playBtn.unbind("click", m.playClick).bind("click", m.playClick);
        // SET AUTO START
        m.autoStart();
        return $this;
    };
    /*
     * MEDIAPLAYERS/INSTANTS/DIAMANTS/GLOSSAIRE SCROLLER
     *
     */
    $.fn.chanelScroller = function(params) {
        var params = $.extend({
            speed: 500,
            margeLeft: 73,
            sliderControlLeft: "#sliderControlLeft",
            sliderControlRight: "#sliderControlRight"
        }, params);
        var $sliderControlLeft = $(params.sliderControlLeft);
        var $sliderControlRight = $(params.sliderControlRight);
        var $scroll = $(this);
        var $scrollContent = $(params.scrollContent);
        var $scrollSlides = $scrollContent.find("li");
        var nbArticle = $scrollContent.find("li").length;
        // SLIDER CHANGE SLIDE CALLBACK
        var changeSlideFunction = function changeSlideFunction(event, ui) {
            var n = 100 / nbArticle;
            var margeLeft = params.margeLeft;
            var value = ui.value;
            var left = -parseInt($scrollSlides[value].style.left);
            // PLACE CURSOR ON RIGHT AT THE LAST SLIDE
            if (ui.value == nbArticle - 1 && nbArticle - 1 > 0) {
                $scroll.find(".ui-slider-handle").css("margin-left", -n + "%");
            } else if (ui.value == 0) {
                $scroll.find(".ui-slider-handle").css("margin-left", "0px");
            } else {
                $scroll.find(".ui-slider-handle").css("margin-left", -n / 2 + "%");
            }
            $scrollSlides.removeClass("active");
            $($scrollSlides[value]).addClass("active");
            $scrollContent.stop().animate({
                left: left + margeLeft + "px"
            }, params.speed);
            // SHOW SCROLLBAR IF MORE THAN ONE ARTICLE 
            if (nbArticle > 1) {
                $scroll.parent().show();
            }
            if (params.sliderControlAlwaysVisible) {
                $sliderControlLeft.show();
                $sliderControlRight.show();
            } else {
                if (nbArticle < 2) {
                    $sliderControlLeft.hide();
                    $sliderControlRight.hide();
                } else switch (value) {
                  case 0:
                    $sliderControlLeft.hide();
                    $sliderControlRight.show();
                    break;

                  case nbArticle - 1:
                    $sliderControlLeft.show();
                    $sliderControlRight.hide();
                    break;

                  default:
                    $sliderControlLeft.show();
                    $sliderControlRight.show();
                }
            }
            switch (event.type) {
              case "slide":
                $scrollContent.trigger("chanelScroller:slide", [ event, ui ]);
                break;

              case "slidechange":
                $scrollContent.trigger("chanelScroller:changeSlide", [ event, ui ]);
                break;
            }
        };
        // SLIDER CREATE CALLBACK
        var createSliderFunction = function createSliderFunction(event, ui) {
            var n = 100 / nbArticle;
            $scroll.width(100 + "%");
            $scroll.find(".ui-slider-handle").width(n + "%");
            $scrollSlides.removeClass("active");
            $scrollContent.trigger("chanelScroller:createSlider", [ event, ui ]);
        };
        // SLIDER INIT PLUGIN
        var $scrollbar = $scroll.slider({
            min: 0,
            max: nbArticle - 1,
            value: 0,
            step: 1,
            slide: changeSlideFunction,
            change: changeSlideFunction,
            create: createSliderFunction
        });
        $scrollbar.slider("value", 0);
        // SET EVENTS
        var mousewheelScrollPane = function mousewheelScrollPane(e, delta, deltaX, deltaY) {
            $scrollbar.slider("value", $scrollbar.slider("value") - deltaY);
        };
        var clickSliderLeft = function clickSliderLeft(e) {
            e.preventDefault();
            $scrollbar.slider("value", $scrollbar.slider("value") - 1);
        };
        var clickSliderRight = function clickSliderRight(e) {
            e.preventDefault();
            $scrollbar.slider("value", $scrollbar.slider("value") + 1);
        };
        $scrollContent.off("mousewheel", mousewheelScrollPane).on("mousewheel", mousewheelScrollPane);
        $sliderControlLeft.off("click", clickSliderLeft).on("click", clickSliderLeft);
        $sliderControlRight.off("click", clickSliderRight).on("click", clickSliderRight);
        return $scrollbar;
    };
    /**
     * SITE NAVIGATION BY KEY PRESS
     * Enable navigation key
     *
     * How to use :
     * Add class keypress-direction to set which key to trigger click
     * on element
     *
     * Classes :
     * nav-keypress-left
     * nav-keypress-right
     * nav-keypress-up
     * nav-keypress-down
     */
    $.fn.setKeyNavigation = function setKeyNavigation() {
        function navKeypress(e) {
            switch (e.keyCode) {
              case 37:
                // KEY LEFT
                $(".nav-keypress-left").trigger("click");
                break;

              case 39:
                // KEY RIGHT
                $(".nav-keypress-right").trigger("click");
                break;

              case 38:
                // KEY UP
                $(".nav-keypress-up").trigger("click");
                break;

              case 40:
                // KEY DOWN
                $(".nav-keypress-down").trigger("click");
                break;
            }
        }
        $(this).off("keydown", navKeypress).on("keydown", navKeypress);
    };
    /*
     * DRAG SCROLLS
     *
     */
    $.fn.chanelDragContent = function(params) {
        var params = $.extend({
            $scrollbar: null,
            direction: "horizontal",
            oldx: null,
            oldy: null
        }, params);
        var d = params.direction == "horizontal" ? "x" : "";
        d = params.direction == "vertical" ? "y" : d;
        if (d == "" || params.$scrollbar == null) return;
        var $scrollContent = $(this);
        var dragstartScrollPane = function(e) {
            params["old" + d] = e.touches[0][d];
        };
        var dragScrollPane = function(e) {
            if (params["old" + d] != null) {
                var distance = e.touches[0][d] - params["old" + d];
                var to = distance * 100 / $scrollContent.width();
                to = params.$scrollbar.slider("value") - to;
                params.$scrollbar.slider("value", to);
            }
            params["old" + d] = e.touches[0][d];
        };
        if (isMobileTablet()) {
            $scrollContent.unbind("dragstart", dragstartScrollPane).bind("dragstart", dragstartScrollPane);
            $scrollContent.unbind("drag", dragScrollPane).bind("drag", dragScrollPane);
        }
    };
})(jQuery);

var sharing = {
    data: {
        HTTP_HOST: "http://" + window.location.hostname + "/watches-finejewelry/",
        API_URL: "http://www.chanel.com/share/",
        WT_sn_id: "",
        minified: 1,
        post: {
            url: "",
            title: "",
            content: "",
            img: "",
            WT_sn_id: "",
            WT_sn_contentName: "",
            WT_sn_websiteName: "",
            WT_sn_sense: "2"
        },
        locale: ""
    },
    setPostData: function(data, WT_sn_id) {
        sharing.data.post = data;
        switch (WT_sn_id) {
          default:
          case "facebook":
          case "twitter":
          case "myspace":
          case "twitter":
          case "tumblr":
          case "hyves":
          case "vkontakte":
          case "orkut":
          case "orkut_full":
          case "kaixin":
          case "sohu":
          case "douban":
          case "naver":
          case "cyworld":
            sharing.data.minified = 1;
            break;

          case "renren":
          case "mixi":
          case "weibo":
            sharing.data.minified = 0;
            break;
        }
        console.log("[SHARING API] :: setPostData :: data ", sharing.data);
        if (WT_sn_id !== "") sharing.data.post.WT_sn_id = WT_sn_id;
        if (data.WT_sn_id !== "") {
            sharing.data.post.WT_sn_id = data.WT_sn_id;
            sharing.data.WT_sn_id = data.WT_sn_id;
        } else {
            sharing.data.post.WT_sn_id = sharing.data.WT_sn_id;
            sharing.data.WT_sn_id = sharing.data.WT_sn_id;
        }
        if (data.locale !== "") {
            sharing.data.post.locale = data.locale;
            sharing.data.locale = data.locale;
        } else {
            sharing.data.post.locale = sharing.data.locale;
            sharing.data.locale = sharing.data.locale;
        }
        if (sharing.data.post.url && sharing.data.post.url.indexOf("-cn.") >= 0) {
            sharing.data.API_URL = "http://www-cn.chanel.com/share/";
        }
        if (sharing.data.post.url && sharing.data.post.url.indexOf(".cn") >= 0) {
            sharing.data.API_URL = "http://www.chanel.cn/share/";
        }
        sharing.data.post.WT_sn_sense = "2";
        sharing.data.post.sharer_url = sharing.data.API_URL + sharing.data.WT_sn_id + "/" + sharing.data.locale + "/" + sharing.data.minified;
        return this;
    },
    share: function(decoded) {
        if (typeof jQuery !== "undefined") {
            if (sharing.data.HTTP_HOST !== "" && sharing.data.locale !== "" && sharing.data.WT_sn_id !== "" && sharing.data.post.url !== "") {
                if (decoded) {
                    return sharing.data.HTTP_HOST + "sharer?" + sharing.serialize(sharing.data.post, decoded);
                } else {
                    return encodeURIComponent(encodeURI(sharing.data.HTTP_HOST + "sharer?" + sharing.serialize(sharing.data.post)));
                }
            } else {
                return {
                    value: false,
                    error: "Valeurs requises non présente !"
                };
            }
        } else {
            return {
                value: false,
                error: "jQuery requis !"
            };
        }
    },
    serialize: function(obj, encoded) {
        var returnVal;
        if (obj != undefined) {
            if (typeof obj == "object") {
                var vobj = [];
                for (attr in obj) {
                    if (typeof obj[attr] != "function") {
                        if (encoded) {
                            vobj.push(attr + "=" + encodeURIComponent(sharing.serialize(obj[attr])));
                        } else {
                            vobj.push(attr + "=" + sharing.serialize(obj[attr]));
                        }
                    }
                }
                if (vobj.length > 0) return vobj.join("&"); else return "";
            } else {
                return obj.toString();
            }
        }
        return null;
    }
};

/**
 * WFJ
 */
(function(_super, $) {
    _super.WFJ = {
        module: {
            _INSTANCES: {}
        },
        userdata: {},
        defaultDocSize: 1256,
        defaultDocSizeHeight: 790,
        lastDocSize: 0,
        actualDocSize: null,
        resVersion: null,
        oldVersion: null,
        anchors: [],
        deepL: [],
        init: function init() {
            this.screenSize();
            this.detectBrowsers();
            this.warning();
        },
        screenSize: function screenSize() {
            var screenWidth = $(window).width();
            var screenHeight = $(window).height();
            if (screenWidth < this.defaultDocSize || isMobileTablet() || screenHeight < this.defaultDocSizeHeight && $.isFunction(Modernizr.mq) && Modernizr.mq("only all")) {
                var changeTo = "small";
                this.actualDocSize = 1e3;
                this.resVersion = "Small";
            } else {
                var changeTo = "wide";
                this.actualDocSize = 1256;
                this.resVersion = "Big";
            }
            if (this.lastDocSize != this.actualDocSize) {
                //                this.changeLayout(changeTo);
                this.lastDocSize = this.actualDocSize;
            }
        },
        detectBrowsers: function detectBrowsers() {
            // IE10 detection
            if (navigator.userAgent.indexOf("MSIE 10") > -1 && document.body.classList) {
                document.body.classList.add("ie10");
            }
        },
        warning: function warning() {
            if ($.cookie("orientation") === null) {
                $("#orientationWarning").addClass("no-cookie");
            }
            $("#orientationWarning").on("click", function() {
                $("#orientationWarning").remove();
                $.cookie("orientation", "1", {
                    path: "/"
                });
            });
        },
        /* changement du styles des elements concernes */
        applyChange: function applyChange(cstyle) {
            $("#centerdiv")[0].className = cstyle;
            $("#productlist")[0].className = cstyle;
            var li1 = $("#galerie li");
            var img1 = $("#galerie img");
            var img2 = $("#products img");
            for (var i = 0; i < img1.length; i++) {
                li1[i].className = cstyle;
                img1[i].className = cstyle;
                img2[i].className = cstyle;
            }
        },
        /* Appel des pages en Ajax */
        geAjaxtContent: function geAjaxtContent(val, target) {
            var $loader = $("#chargement");
            var $level1 = $("#level1");
            var $level2 = $("#level2");
            var collection = $level1.val();
            collection += $level2.val() != "" ? "-" + $level2.val() : "";
            $loader.show();
            $.ajax({
                type: "GET",
                url: "/" + val,
                data: {
                    collection: collection
                },
                success: function(result) {
                    $("#" + target).html(result);
                    $loader.hide();
                },
                complete: function(result) {
                    WFJ.getDataController();
                }
            });
        },
        setStoreLocatorLink: function() {
            var URL = "https://secure.chanel.com/global-service/frontend/store_locator/search/%locale%/watches-fine-jewelry";
            URL = URL.replace("%locale%", locale);
            $("#store-locator-link, .store-locator-link").on("click", function(e) {
                //                console.log("ok");
                e.preventDefault();
                $("#inline_popup3").removeClass("nodisplay").show();
                $("#popin3").find("#contentPopin3").html("<iframe width='900' height='550' src='" + URL + "' frameborder='no'></iframe>");
                $("#popin3").addClass("store-locator");
            });
        },
        /* appropriation des liens et modificiation pour le deep link et actions js speciales */
        anchorProcess: function anchorProcess() {
            this.anchors = [];
            if (this.anchors.length < 1) {}
            this.anchors = window.document.getElementsByTagName("a");
            var currentAnchor;
            for (var i = 0; i < this.anchors.length; i++) {
                currentAnchor = this.anchors[i];
                var currentAnchorName;
                if (jQuery(currentAnchor).hasClass("deeplink-id")) {
                    currentAnchorName = "id|" + $(this).attr("name");
                } else if (jQuery(currentAnchor).hasClass("deeplink-js")) {
                    currentAnchorName = "js|" + $(this).attr("name");
                } else {
                    currentAnchorName = "";
                }
                if (currentAnchorName != "" && currentAnchorName.indexOf("|") != -1) {
                    currentAnchor.pos = i;
                    currentAnchor.link = decodeURIComponent(currentAnchor.href);
                    currentAnchor.functiononclick = currentAnchor.onclick;
                    currentAnchor.style.cursor = "pointer";
                    currentAnchor.onTarget = currentAnchorName.split("|");
                    var parseURL = currentAnchor.link.split("?");
                    var getParam = "?" + parseURL[1];
                    var dlTitle = parseURL[0].replace(basehref, "").replace(siteloc, "");
                    var newTitle = dlTitle.replace(" ", "-");
                    this.deepL[newTitle] = currentAnchor;
                    if (currentAnchor.onTarget[0] == "js") {
                        currentAnchor.href = currentAnchor.link;
                        eval(currentAnchor.onTarget[1]);
                        return false;
                    } else {
                        // deep link
                        currentAnchor.onclick = function() {
                            var parseURL = decodeURIComponent(this.href).split("?");
                            var getParam = "?" + parseURL[1];
                            var dlTitle = parseURL[0].replace(basehref, "").replace(siteloc, "");
                            // Cause un problème de stack Overflow sur IE
                            if (this.functiononclick != undefined) {
                                this.functiononclick();
                            }
                            WFJ.goToLink(dlTitle.replace(" ", "-"));
                            return false;
                        };
                    }
                    currentAnchorName = "";
                    jQuery(currentAnchor).removeClass("deeplink-js");
                    jQuery(currentAnchor).removeClass("deeplink-id");
                    currentAnchor.name = "";
                }
            }
            return;
        },
        goToLink: function goToLink(n) {
            if (this.deepL[n]) {
                WFJ.geAjaxtContent(this.deepL[n].link, this.deepL[n].onTarget[1]);
            } else {
                if (n) {
                    if (n.substring(0, 1) == "/") {
                        n = n.substring(1);
                    }
                    n = n.replace(basehref + siteloc, "");
                    WFJ.geAjaxtContent(basehref + siteloc + n, "centerdiv");
                } else {
                    WFJ.geAjaxtContent(basehref + siteloc, "centerdiv");
                }
            }
        },
        getDataController: function getDataController(reloadGlobalModule) {
            var _this = this, module;
            if (reloadGlobalModule !== false) _this.reloadGlobalModule();
            $("[data-controller]").each(function(i) {
                var self = this;
                module = $(this).data("controller").split(" ");
                var jsPath = $(this).data("controller-path");
                for (i = 0, j = module.length; i < j; i++) {
                    console.log("Module :: " + module[i]);
                    var executeController = function() {
                        WFJ.module._INSTANCES[module[i]] = new WFJ.module[module[i]]();
                        if (typeof WFJ.module._INSTANCES[module[i]].init !== "undefined") {
                            WFJ.module._INSTANCES[module[i]].init();
                        }
                    };
                    executeController();
                }
                $(self).removeAttr("data-controller").removeAttr("data-controller-path");
            });
            this.sendStatsPage();
        },
        reloadGlobalModule: function reloadGlobalModule() {
            var _this = this;
            if (typeof pagename == "undefined") {
                var pagename = new Array();
            }
            if (typeof reload === "undefined") {
                var reload = true;
            }
            if (typeof target === "undefined") {
                var target = "centerdiv";
            }
            if (typeof page === "undefined") {
                var params = new Array();
                var url = window.location.toString();
                params["page"] = $("#pagename").val();
                pagename["centerdiv"] = params["page"];
            }
            if (target === "centerdiv") {
                $("#inline_popup").hide();
                $("#inline_popup2").hide();
                $("#popin").html("");
                $("#popin2").html("");
            }
            return _this;
        },
        setUserdata: function setUserdata(key, value) {
            this.userdata[key] = value;
        },
        getUserdata: function getUserdata(key) {
            return this.userdata[key] ? this.userdata[key] : null;
        },
        sendStatsPage: function sendStatsPage() {
            var dl, page_name, send_stats, data = {};
            var DEBUG = false;
            page_name = $("#pagename").val() || subsection_id;
            data.ch_re = ch_re;
            data.ch_lang = ch_lang;
            data.cg_n = cg_n;
            data.cg_s = cg_s;
            data.ch_div = ch_div;
            data.ch_cat = ch_cat;
            data.ch_scat1 = ch_scat1;
            data.ch_scat2 = ch_scat2;
            data.ch_prod = ch_prod;
            data.dl = dl;
            if ($(" #cg_s").length && $("#cg_s").val() != "") {
                data.cg_s = $("#cg_s").val();
            } else {
                data.cg_s = cg_s_original;
            }
            if ($("#ch_cat").length && $("#ch_cat").val() != "") {
                data.ch_cat = $("#ch_cat").val();
            } else {
                data.ch_cat = ch_cat_original;
            }
            if ($("#dl").length && $("#dl").val() != "") {
                data.dl = $("#dl").val();
            } else {
                data.dl = 0;
            }
            // TODO : CHECk Conflict with webtrends, it call be a double call of dsc.gif
            if (DEBUG) {
                console.log("=========================");
                console.log(":: page_name ::");
                console.log(page_name);
                console.log("=========================");
                for (var attr in data) {
                    console.log(":: " + attr + " :: ");
                    console.log(data[attr]);
                    console.log("_________________________");
                }
                console.log("=========================");
            }
            switch (page_name) {
              case "customer_services":
              case "camelia_galbe_specificities":
              case "camelia_galbe_stores":
              case "diamant":
              case "imprimer":
              case "newsletter":
              case "instants":
              case "collection":
              case "coco_collection":
                send_stats = false;
                break;

              default:
                send_stats = true;
            }
            if (send_stats) {
                stats(data.ch_re, data.ch_lang, data.cg_n, data.cg_s, data.ch_div, data.ch_cat, data.ch_scat1, data.ch_scat2, data.ch_prod, data.dl);
            }
        }
    };
    _super.WFJ.ecrin = {
        add: function add(data, type) {
            var _this = this, cookie = this.getCookie();
            cookie = cookie.aItem[type];
            data = data.split(",");
            for (var i = 0, j = data.length; i < j; i++) {
                if (!$.inArray(data[i], data) && typeof data[i] === "string") {
                    cookie.push(data[i]);
                }
            }
            $.cookie(type, cookie, {
                expires: 30,
                path: "/"
            });
            this.updateLinkEcrin();
            return;
        },
        deleteFromEcrin: function deleteFromEcrin(data, type) {
            var _this = this, cookie = this.getCookie();
            cookie = cookie.aItem[type];
            data = data.split(",");
            for (i = 0, j = data.length; i < j; i++) {
                for (k = 0, l = cookie.length; k < l; k++) {
                    if (cookie[k] == data[i]) {
                        cookie.splice(k, 1);
                    }
                }
            }
            $.cookie(type, cookie, {
                expires: 30,
                path: "/"
            });
            this.updateLinkEcrin();
            return;
        },
        getFromEcrin: function getFromEcrin(data) {},
        checkInEcrin: function checkInEcrin(ref) {
            var cookie = this.getCookie(), i, j;
            for (i = 0, j = cookie.aItem.watches.length; i < j; i++) {
                if (cookie.aItem.watches[i] == ref) return true;
            }
            for (i = 0, j = cookie.aItem.jewelry.length; i < j; i++) {
                if (cookie.aItem.jewelry[i] == ref) return true;
            }
            return false;
        },
        countEcrin: function countEcrin() {
            var _this = this, ecrin = _this.getCookie();
            return ecrin.iNbItem;
        },
        deleteCookie: function deleteCookie() {
            $.cookie("watches", "", {
                expires: 30,
                path: "/"
            });
            $.cookie("jewelry", "", {
                expires: 30,
                path: "/"
            });
        },
        getCookie: function getCookie() {
            var watches = $.cookie("watches"), jewelry = $.cookie("jewelry"), ecrin = {};
            if (typeof ecrin.aItem === "undefined") {
                ecrin.aItem = {
                    watches: new Array(),
                    jewelry: new Array()
                };
            }
            if (watches != "" && watches !== null) ecrin.aItem.watches = watches.split(",");
            if (jewelry != "" && jewelry !== null) ecrin.aItem.jewelry = jewelry.split(",");
            ecrin.iNbItem = ecrin.aItem.watches.length + ecrin.aItem.jewelry.length;
            return ecrin;
        },
        updateLinkEcrin: function updateLinkEcrin() {
            var link = $(".link-ecrin"), cookie = this.getCookie(), product_list = null, href = link.attr("href");
            if (typeof href == "undefined") return;
            if (typeof this.link_ecrin == "undefined") this.link_ecrin = href;
            if (cookie.iNbItem > 0) {
                product_list = cookie.aItem.watches.concat(cookie.aItem.jewelry).join(",");
            } else return;
            $(".listItemBox a.viewEcrin, .delFromEcrin").each(function(i) {
                var href = $(this).attr("href"), new_href = "";
                if (href.indexOf("?") == "-1") new_href = href + "?product_list=" + product_list; else new_href = href + "&product_list=" + product_list;
                $(this).attr("href", new_href);
            });
            if (this.link_ecrin.indexOf("?") == "-1") href = this.link_ecrin + "?product_list=" + product_list; else href = this.link_ecrin + "&product_list=" + product_list;
            link.attr("href", href);
        }
    };
})(window, jQuery);

/* DOM.LOAD */
var $html = $("html"), isIEnoResponsive = $html.hasClass("ie6") || $html.hasClass("ie7") || $html.hasClass("ie8");

$(document).ready(function() {
    var $globaldiv = $("#globaldiv");
    $("#noflash.slideshow").hide();
    $("#list_link").mouseenter(function() {
        $("ul", this).css("visibility", "visible");
    });
    $("#list_link").mouseleave(function() {
        $("ul", this).css("visibility", "hidden");
    });
    $globaldiv.data("top", $globaldiv.css("top"));
    $globaldiv.data("margin-top", $globaldiv.css("margin-top"));
    if (!isMobileTablet()) $(window).trigger("resize");
    WFJ.init();
    WFJ.ecrin.updateLinkEcrin();
    WFJ.getDataController();
    WFJ.setStoreLocatorLink();
    /**
   * SITE NAVIGATION BY KEY PRESS
   * Enable navigation key
   * 
   * How to use : 
   * Add class keypress-direction to set which key to trigger click 
   * on element
   * 
   * Classes :
   * nav-keypress-left
   * nav-keypress-right
   * nav-keypress-up
   * nav-keypress-down
   */
    $("html").setKeyNavigation();
    $(".delay_stats").on("click", delay_stats);
    // popins from nav corporate
    $(document).on("serviceOpen.ccservices", function() {
        if (!$("html").hasClass("ie7")) {
            window.universal_variable.events.push({
                virtual_page_view: location.pathname + location.hash
            });
        }
    });
});

$(window).on("resize", function() {
    WFJ.screenSize();
    $("body").trigger("window:resize");
    if (WFJ.oldVersion != WFJ.resVersion) $("body").trigger("window:changeresize");
    WFJ.oldVersion = WFJ.resVersion;
    if (isIEnoResponsive) {
        if ($(window).height() <= $("#globaldiv").height()) {
            $("#globaldiv").addClass("stickyTop");
        } else {
            $("#globaldiv").removeClass("stickyTop");
        }
    }
});

/* DOCUMENT.LOAD */
$(window).bind("load", function() {
    var $globaldiv = $("#globaldiv");
    if (!swfobject.getFlashPlayerVersion().major) $("#noflash.slideshow").show();
    if (!swfobject.getFlashPlayerVersion().major) setTimeout(function() {
        $("#hj_globaldiv").show();
    }, 1e3);
    setTimeout('$("#ecrin_nbitem").show();', 500);
    // HIDE ADRESS BAR ON PHONE DEVICES
    setTimeout(function() {
        try {
            window.scrollTo(0, 1);
        } catch (e) {}
    }, 0);
    if (DEVICE_TYPE != "mobile") {
        $globaldiv.css("position", "absolute");
    }
});

(function(window) {
    window.console = window.console || {
        log: function(message) {}
    };
})(window);

function delay_stats(e) {
    e.preventDefault();
    var $this = $(this);
    stats(ch_re, ch_lang, cg_n, "Coulisses de Chanel", ch_div, "Coulisses de Chanel", "Coulisses home", "", "", 0);
    setTimeout(function() {
        window.location.href = $this.attr("href");
    }, 1e3);
}

/*
 * bridal_anim
 */
(function(_super, $) {
    var _m_;
    _super.bridal_anim = function() {
        var _this = this;
        var xmlFile;
        var lngBridal;
        // TODO: CHANEL // Refactoring
        /* CONTENU FLASH BRIDAL */
        if (swfobject.getFlashPlayerVersion().major) {
            lngBridal = sitelocEncoded.split("/")[0];
            if (lngBridal == "ja_JP") xmlFile = path_site + "assets/bridal/xml/conf_jp.xml"; else xmlFile = path_site + "assets/bridal/xml/conf.xml";
            var params = {
                quality: "high",
                wmode: "transparent",
                scale: "noscale",
                allowFullScreen: "true",
                allowscriptaccess: "always",
                bgcolor: "#ffffff"
            };
            var flashvars = {
                lg: lngBridal,
                xml: xmlFile
            };
            if (WFJ.resVersion == "Big") {
                flashvars.resolution = "";
            } else {
                flashvars.resolution = "1024";
            }
            var attributes = {
                id: "flashcontent",
                name: "flashcontent"
            };
            swfobject.embedSWF(path_site + "assets/bridal/swf/bridalAnim.swf", "noflash", "100%", "100%", "9.0.124", path_site + "_swf/expressInstall.swf", flashvars, params, attributes);
            $("#wrapper_element_right").hide();
            $("#wrapper_element_left").hide();
            $("#noflash").hide();
        } else {
            lngBridal = sitelocEncoded.split("/")[0];
            /* Paramètres de l'animation */
            var paramsBridal = {
                current: 0,
                currentPage: 1,
                nbpage: 0,
                zoomed: false,
                currentImg: null,
                oldPosX: 0,
                oldPosY: 0,
                totalImg: 0,
                rightMax: 0,
                moduleW: 0,
                moduleY: 0,
                speed: 1e3,
                startMoveIpad: true,
                startXIpad: 0,
                distanceToSlide: 150,
                smallZoom: "25%",
                bigZoom: "34%",
                fps: 50,
                oldTypoSize: "18px",
                delay: 300
            };
            var Left = 0;
            var Moved = false;
            var positionsImg = new Array();
            var positionPage = new Array();
            var positionTextSmall = new Array();
            var zoomReduce;
            var $wrapper_bridal_anim = $("#wrapper_bridal_anim");
            var $moveLeftPageAnim = $("#moveLeftPageAnim");
            var $btnCloseBridal = $("#btnCloseBridal");
            var $moveRightPageAnim = $("#moveRightPageAnim");
            var $pageImg = $("#pageImg");
            $moveLeftPageAnim.css({
                left: "-40px"
            });
            if (WFJ.resVersion == "Small") {
                $btnCloseBridal.css({
                    width: "20px"
                });
                $moveLeftPageAnim.css({
                    width: "20px"
                });
                $moveRightPageAnim.css({
                    right: "-40px",
                    bottom: "0px",
                    height: "210px",
                    width: "20px"
                }).delay(paramsBridal.delay).animate({
                    right: "0px"
                }, paramsBridal.speed);
            } else $moveRightPageAnim.css({
                right: "-40px",
                bottom: "0px",
                height: "280px"
            }).delay(paramsBridal.delay).animate({
                right: "0px"
            }, paramsBridal.speed);
            $pageImg.find("div span").css({
                "font-size": "18px",
                padding: "5px"
            });
            // GET IMG POSITIONS
            $("#pageImg .img").each(function() {
                positionsImg.push($(this).position());
            });
            // GET DIVS POSITIOSN
            $("#pageImg div").each(function() {
                positionTextSmall[$(this).attr("rel")] = $(this).position();
            });
            // GET PAGE ON POSITIOSN
            $("#pageImg .pageon").each(function() {
                positionPage.push($(this).position());
            });
            // SET DIVS WIDTHS
            $pageImg.delay(paramsBridal.delay).find("div").css("width", "1500px");
            paramsBridal.totalImg = $("#pageImg img").length;
            zoomReduce = WFJ.resVersion == "Small" ? paramsBridal.smallZoom : paramsBridal.bigZoom;
            $pageImg.css({
                zoom: zoomReduce,
                left: -positionPage[0]["left"]
            });
            paramsBridal.moduleW = $wrapper_bridal_anim.width();
            paramsBridal.moduleH = $wrapper_bridal_anim.height();
            paramsBridal.nbpage = $("#wrapper_bridal_anim .pageon").length;
            /* Changement de page // non zoomé */
            function bridalMoveTo(goTo) {
                if (!paramsBridal.zoomed) {
                    if (goTo <= 0 && goTo > -paramsBridal.nbpage) {
                        if (goTo == 0) {
                            $moveLeftPageAnim.animate({
                                left: "-40px",
                                top: "0px"
                            });
                            if (WFJ.resVersion == "Small") $moveRightPageAnim.css({
                                right: "-40px",
                                height: "210px",
                                bottom: "0px"
                            }).delay(paramsBridal.delay).animate({
                                right: "0px"
                            }, paramsBridal.speed); else $moveRightPageAnim.css({
                                right: "-40px",
                                height: "280px",
                                bottom: "0px"
                            }).delay(paramsBridal.delay).animate({
                                right: "0px"
                            }, paramsBridal.speed);
                        } else if (goTo == -paramsBridal.nbpage + 1) {
                            if (WFJ.resVersion == "Small") $moveLeftPageAnim.css({
                                left: "-40px",
                                height: "210px"
                            }).delay(paramsBridal.delay).animate({
                                left: "0px"
                            }, paramsBridal.speed); else $moveLeftPageAnim.css({
                                left: "-40px",
                                height: "285px"
                            }).delay(paramsBridal.delay).animate({
                                left: "0px"
                            }, paramsBridal.speed);
                            $moveRightPageAnim.animate({
                                right: "-40px",
                                bottom: "0px"
                            });
                        } else {
                            if (WFJ.resVersion == "Small" && lngBridal == "ja_JP") {
                                $moveLeftPageAnim.css({
                                    left: "-40px",
                                    height: "117px",
                                    top: "0px"
                                }).delay(paramsBridal.delay).animate({
                                    left: "0px"
                                }, paramsBridal.speed);
                                $moveRightPageAnim.css({
                                    right: "-40px",
                                    height: "210px",
                                    bottom: "0px"
                                }).delay(paramsBridal.delay).animate({
                                    right: "0px"
                                }, paramsBridal.speed);
                            } else if (WFJ.resVersion == "Small" && lngBridal != "ja_JP") {
                                $moveLeftPageAnim.css({
                                    left: "-40px",
                                    height: "210px",
                                    top: "0px"
                                }).delay(paramsBridal.delay).animate({
                                    left: "0px"
                                }, paramsBridal.speed);
                                $moveRightPageAnim.css({
                                    right: "-40px",
                                    height: "235px",
                                    bottom: "0px"
                                }).delay(paramsBridal.delay).animate({
                                    right: "0px"
                                }, paramsBridal.speed);
                            } else if (lngBridal == "ja_JP" && WFJ.resVersion != "Small") {
                                $moveLeftPageAnim.css({
                                    left: "-40px",
                                    height: "157px",
                                    top: "0px"
                                }).delay(paramsBridal.delay).animate({
                                    left: "0px"
                                }, paramsBridal.speed);
                                $moveRightPageAnim.css({
                                    right: "-40px",
                                    height: "280px",
                                    bottom: "0px"
                                }).delay(paramsBridal.delay).animate({
                                    right: "0px"
                                }, paramsBridal.speed);
                            } else if (lngBridal != "ja_JP" && WFJ.resVersion != "Small") {
                                $moveLeftPageAnim.css({
                                    left: "-40px",
                                    height: "285px",
                                    top: "0px"
                                }).delay(paramsBridal.delay).animate({
                                    left: "0px"
                                }, paramsBridal.speed);
                                $moveRightPageAnim.css({
                                    right: "-40px",
                                    height: "280px",
                                    bottom: "0px"
                                }).delay(paramsBridal.delay).animate({
                                    right: "0px"
                                }, paramsBridal.speed);
                            }
                        }
                        var Left = -positionPage[goTo * -1]["left"];
                        $pageImg.stop(false, true).delay(paramsBridal.delay).animate({
                            left: Left
                        }, {
                            duration: 200,
                            step: function(now, fx) {
                                if (fx.prop == "left") {
                                    fx.start = paramsBridal.oldPosX;
                                }
                                paramsBridal.oldPosX = -positionPage[goTo * -1]["left"];
                                paramsBridal.oldPosY = "0px";
                            },
                            complete: function() {
                                paramsBridal.current = goTo;
                            }
                        });
                    }
                }
            }
            /* Changement d'image // zoomé */
            function moveToImg(eq) {
                if (eq < paramsBridal.totalImg && eq >= 0) {
                    Moved = true;
                    paramsBridal.currentImg = eq;
                    var currentImg = $("#pageImg img.img:eq(" + eq + ")");
                    var currentRel = $("#pageImg img.img:eq(" + eq + ")").attr("rel");
                    var ratio = $wrapper_bridal_anim.width() / $wrapper_bridal_anim.height();
                    if (currentImg.width() / ratio > currentImg.height()) {
                        /* Pourcentage de largeur de l'image par rapport a la largeur du conteneur */
                        var pourc = $("#pageImg img.img:eq(" + currentImg.index() + ")").width() * 100 / $wrapper_bridal_anim.width();
                        var pourc2 = 100 / pourc * 100;
                        if (isMobileTablet()) {
                            var imgpos = {
                                left: currentImg.css("left"),
                                top: currentImg.css("top")
                            };
                        } else {
                            imgpos = {
                                left: currentImg.css("left"),
                                top: currentImg.css("top")
                            };
                        }
                        var moveLeft = "-" + imgpos.left;
                        var moveRight = "-" + imgpos.top;
                        moveLeft = parseInt(moveLeft.replace("px", ""));
                        moveRight = parseInt(moveRight.replace("px", ""));
                        var height = paramsBridal.moduleH / (pourc2 / 100) / 2 - $("#pageImg .img:eq(" + eq + ")").height() / 2;
                        if (isMobileTablet() && !paramsBridal.zoomed) {
                            /*moveLeft = moveLeft/(parseInt(zoomReduce.replace("%",""))/100);
				moveRight = moveRight/(parseInt(zoomReduce.replace("%",""))/100)+height;*/
                            moveLeft = -positionsImg[currentImg.index()]["left"];
                            moveRight = -positionsImg[currentImg.index()]["top"] + height;
                        } else if (isMobileTablet() && paramsBridal.zoomed) {
                            moveLeft = -positionsImg[currentImg.index()]["left"];
                            moveRight = -positionsImg[currentImg.index()]["top"] + height;
                        } else {
                            moveLeft = moveLeft;
                            moveRight = moveRight + height;
                        }
                        var imgclick = currentImg.index();
                        pourc = pourc2;
                    } else {
                        /* Pourcentage de largeur de l'image par rapport a la largeur du conteneur */
                        pourc = $("#pageImg img.img:eq(" + currentImg.index() + ")").height() * 100 / paramsBridal.moduleH;
                        pourc2 = 100 / pourc * 100;
                        if (isMobileTablet()) {
                            imgpos = {
                                left: currentImg.css("left"),
                                top: currentImg.css("top")
                            };
                        } else {
                            imgpos = {
                                left: currentImg.css("left"),
                                top: currentImg.css("top")
                            };
                        }
                        moveLeft = "-" + imgpos.left;
                        moveRight = "-" + imgpos.top;
                        moveLeft = parseInt(moveLeft.replace("px", ""));
                        moveRight = parseInt(moveRight.replace("px", ""));
                        var width = paramsBridal.moduleW / (pourc2 / 100) / 2 - $("#pageImg .img:eq(" + currentImg.index() + ")").width() / 2;
                        if (isMobileTablet() && !paramsBridal.zoomed) {
                            // TODO: supprimer le code commenté
                            /*moveLeft = moveLeft/(parseInt(zoomReduce.replace("%",""))/100)+width;
				moveRight = moveRight/(parseInt(zoomReduce.replace("%",""))/100);*/
                            moveLeft = -positionsImg[currentImg.index()]["left"] + width;
                            moveRight = -positionsImg[currentImg.index()]["top"];
                        } else if (isMobileTablet() && paramsBridal.zoomed) {
                            moveLeft = -positionsImg[currentImg.index()]["left"] + width;
                            moveRight = -positionsImg[currentImg.index()]["top"];
                        } else {
                            moveLeft = moveLeft + width;
                            moveRight = moveRight;
                        }
                        imgclick = currentImg.index();
                        pourc = pourc2;
                    }
                    var fontSize = 13;
                    if (!paramsBridal.zoomed) {
                        $moveLeftPageAnim.delay(paramsBridal.delay).css({
                            left: "-40px",
                            top: "0px"
                        });
                        $moveRightPageAnim.delay(paramsBridal.delay).css({
                            right: "-40px"
                        });
                    }
                    if (currentImg.index() == 0) {
                        $moveLeftPageAnim.delay(paramsBridal.delay).animate({
                            left: "-40px",
                            top: "0px"
                        });
                        $moveRightPageAnim.delay(paramsBridal.delay).animate({
                            height: "100%",
                            right: "0px",
                            bottom: "0px"
                        });
                    } else if (currentImg.index() == paramsBridal.totalImg - 1) {
                        $moveLeftPageAnim.delay(paramsBridal.delay).animate({
                            height: "100%",
                            left: "0px",
                            top: "0px"
                        });
                        $moveRightPageAnim.css({
                            "background-image": "none"
                        }).delay(paramsBridal.delay).animate({
                            right: "0px",
                            height: "100%"
                        });
                    } else {
                        $moveLeftPageAnim.delay(paramsBridal.delay).animate({
                            height: "100%",
                            left: "0px",
                            bottom: "0px"
                        });
                        $moveRightPageAnim.css({
                            "background-image": "url('/watches-finejewelry/template/desktop/img/bridal_right.jpg')"
                        }).delay(paramsBridal.delay).animate({
                            height: "100%",
                            right: "0px",
                            bottom: "0px"
                        });
                    }
                    $("#pageImg img.img").fadeIn();
                    $("#pageImg div").fadeIn();
                    if (positionTextSmall[currentRel + "Big"]) {
                        var textPos = {
                            left: positionTextSmall[currentRel + "Big"]["left"] + "px",
                            top: positionTextSmall[currentRel + "Big"]["top"] + "px"
                        };
                        $pageImg.find("div[rel=" + currentRel + "]").delay(paramsBridal.delay).animate({
                            left: textPos.left,
                            top: textPos.top
                        }, {
                            duration: paramsBridal.speed,
                            step: function(now, fx) {
                                if (fx.prop == "left") {
                                    fx.start = positionTextSmall[currentRel]["left"];
                                }
                                if (fx.prop == "top") {
                                    fx.start = positionTextSmall[currentRel]["top"];
                                }
                            },
                            complete: function() {
                                paramsBridal.oldTextPosX = textPos.left;
                                paramsBridal.oldTextPosY = textPos.top;
                            }
                        });
                    }
                    $("#pageImg div span").delay(paramsBridal.delay).animate({
                        "font-size": fontSize + "px"
                    }, {
                        duration: paramsBridal.speed,
                        step: function(now, fx) {
                            if (fx.prop == "font-size") {
                                fx.start = paramsBridal.oldTypoSize;
                            }
                        }
                    });
                    $pageImg.delay(paramsBridal.delay).animate({
                        zoom: pourc + "%",
                        left: moveLeft,
                        top: moveRight
                    }, {
                        duration: paramsBridal.speed,
                        step: function(now, fx) {
                            if (fx.prop == "left") {
                                fx.start = paramsBridal.oldPosX;
                            }
                            if (fx.prop == "top" && paramsBridal.zoomed == true) {
                                fx.start = paramsBridal.oldPosY;
                            }
                        },
                        complete: function() {
                            $("#pageImg img.img:not(:eq(" + imgclick + "))").delay(paramsBridal.delay).fadeOut(500, function() {
                                Moved = false;
                                paramsBridal.oldPosX = moveLeft;
                                paramsBridal.oldPosY = moveRight;
                                paramsBridal.oldTypoSize = fontSize + "px";
                                if (!paramsBridal.zoomed) {
                                    paramsBridal.zoomed = true;
                                }
                            });
                            $("#pageImg div[rel!=" + $("#pageImg img.img:eq(" + currentImg.index() + ")").attr("rel") + "]").delay(paramsBridal.delay).fadeOut();
                        }
                    });
                }
            }
            if (isMobileTablet()) {
                document.getElementById("wrapper_bridal_anim").ontouchstart = function(e) {
                    paramsBridal.startMoveIpad = false;
                    paramsBridal.startXIpad = e.touches.item(0);
                    paramsBridal.startXIpad = paramsBridal.startXIpad.clientX;
                };
                document.getElementById("wrapper_bridal_anim").ontouchmove = function(e) {
                    if (!Moved) {
                        if (!paramsBridal.startMoveIpad) {
                            var xMove = e.touches.item(0);
                            xMove = xMove.clientX;
                            if (xMove < paramsBridal.startXIpad - paramsBridal.distanceToSlide) {
                                if (paramsBridal.zoomed) {
                                    moveToImg(paramsBridal.currentImg + 1);
                                    paramsBridal.startMoveIpad = true;
                                } else {
                                    bridalMoveTo(paramsBridal.current - 1);
                                    paramsBridal.startMoveIpad = true;
                                }
                            }
                            if (xMove > paramsBridal.startXIpad + paramsBridal.distanceToSlide) {
                                if (paramsBridal.zoomed) {
                                    moveToImg(paramsBridal.currentImg - 1);
                                    paramsBridal.startMoveIpad = true;
                                } else {
                                    bridalMoveTo(paramsBridal.current + 1);
                                    paramsBridal.startMoveIpad = true;
                                }
                            }
                        }
                    }
                    e.preventDefault();
                };
            }
            /* Bouton page précédente // image suivante */
            $moveLeftPageAnim.click(function() {
                if (!Moved) if (!paramsBridal.zoomed) bridalMoveTo(paramsBridal.current + 1); else moveToImg(paramsBridal.currentImg - 1);
            });
            /* Bouton page suivante // image suivante */
            $moveRightPageAnim.click(function() {
                if (!Moved) if (!paramsBridal.zoomed) bridalMoveTo(paramsBridal.current - 1); else moveToImg(paramsBridal.currentImg + 1);
            });
            /* Action de click sur une image // non zoomé */
            $("#pageImg img.img").click(function() {
                if (!paramsBridal.zoomed) {
                    $moveRightPageAnim.delay(paramsBridal.delay).fadeIn(paramsBridal.speed);
                    $moveLeftPageAnim.delay(paramsBridal.delay).fadeIn(paramsBridal.speed);
                    $btnCloseBridal.delay(paramsBridal.delay).fadeIn(paramsBridal.speed);
                    paramsBridal.currentImg = $(this).index();
                    moveToImg(paramsBridal.currentImg);
                }
            });
            /* Bouton de fermeture d'une image et retour à l'affichage en mode page // zoomé */
            $btnCloseBridal.click(function() {
                if (!Moved) {
                    $pageImg.delay(paramsBridal.delay).animate({
                        zoom: zoomReduce,
                        left: -positionPage[paramsBridal.current * -1]["left"],
                        top: "0px"
                    }, {
                        duration: paramsBridal.speed,
                        step: function(now, fx) {
                            if (fx.prop == "left") {
                                fx.start = paramsBridal.oldPosX;
                            }
                            if (fx.prop == "top") {
                                fx.start = paramsBridal.oldPosY;
                            }
                        },
                        complete: function() {
                            paramsBridal.oldPosX = -positionPage[paramsBridal.current * -1]["left"];
                            paramsBridal.oldPosY = "0px";
                        }
                    });
                    $pageImg.find("div").each(function() {
                        var closeLeft = positionTextSmall[$(this).attr("rel")]["left"];
                        var closeTop = positionTextSmall[$(this).attr("rel")]["top"];
                        $(this).fadeIn().delay(paramsBridal.delay).animate({
                            "font-size": "18px",
                            left: closeLeft,
                            top: closeTop
                        }, {
                            step: function(now, fx) {
                                if (positionTextSmall[$(this).attr("rel") + "Big"]) {
                                    if (fx.prop == "left") {
                                        fx.start = positionTextSmall[$(this).attr("rel") + "Big"]["left"];
                                    }
                                    if (fx.prop == "top") {
                                        fx.start = positionTextSmall[$(this).attr("rel") + "Big"]["top"];
                                    }
                                }
                            }
                        });
                    });
                    paramsBridal.zoomed = false;
                    $moveRightPageAnim.css({
                        "background-image": "url('/watches-finejewelry/template/desktop/img/bridal_right.jpg')"
                    });
                    if (paramsBridal.current == 0) {
                        $moveLeftPageAnim.animate({
                            left: "-40px"
                        });
                        if (WFJ.resVersion == "Small") $moveRightPageAnim.css({
                            right: "-40px",
                            height: "210px",
                            bottom: "0px"
                        }).delay(paramsBridal.delay + paramsBridal.speed).animate({
                            right: "0px"
                        }, paramsBridal.speed); else $moveRightPageAnim.css({
                            right: "-40px",
                            height: "280px",
                            bottom: "0px"
                        }).delay(paramsBridal.delay + paramsBridal.speed).animate({
                            right: "0px"
                        }, paramsBridal.speed);
                    } else if (paramsBridal.current == -paramsBridal.nbpage + 1) {
                        if (WFJ.resVersion == "Small") $moveLeftPageAnim.css({
                            left: "-40px",
                            height: "210px"
                        }).delay(paramsBridal.delay + paramsBridal.speed).animate({
                            left: "0px"
                        }, paramsBridal.speed); else $moveLeftPageAnim.css({
                            left: "-40px",
                            height: "285px"
                        }).delay(paramsBridal.delay + paramsBridal.speed).animate({
                            left: "0px"
                        }, paramsBridal.speed);
                        $moveRightPageAnim.animate({
                            right: "-40px"
                        });
                    } else {
                        if (WFJ.resVersion == "Small" && lngBridal == "ja_JP") {
                            $moveLeftPageAnim.css({
                                left: "-40px",
                                height: "117px"
                            }).delay(paramsBridal.delay + paramsBridal.speed).animate({
                                left: "0px"
                            }, paramsBridal.speed);
                            $moveRightPageAnim.css({
                                right: "-40px",
                                height: "210px",
                                bottom: "0px"
                            }).delay(paramsBridal.delay + paramsBridal.speed).animate({
                                right: "0px"
                            }, paramsBridal.speed);
                        } else if (WFJ.resVersion == "Small" && lngBridal != "ja_JP") {
                            $moveLeftPageAnim.css({
                                left: "-40px",
                                height: "210px",
                                top: "0px"
                            }).delay(paramsBridal.delay).animate({
                                left: "0px"
                            }, paramsBridal.speed);
                            $moveRightPageAnim.css({
                                right: "-40px",
                                height: "235px",
                                bottom: "0px"
                            }).delay(paramsBridal.delay).animate({
                                right: "0px"
                            }, paramsBridal.speed);
                        } else if (lngBridal == "ja_JP") {
                            $moveLeftPageAnim.css({
                                left: "-40px",
                                height: "157px"
                            }).delay(paramsBridal.delay + paramsBridal.speed).animate({
                                left: "0px"
                            }, paramsBridal.speed);
                            $moveRightPageAnim.css({
                                right: "-40px",
                                height: "280px",
                                bottom: "0px"
                            }).delay(paramsBridal.delay + paramsBridal.speed).animate({
                                right: "0px"
                            }, paramsBridal.speed);
                        } else {
                            $moveLeftPageAnim.css({
                                left: "-40px",
                                height: "285px"
                            }).delay(paramsBridal.delay + paramsBridal.speed).animate({
                                left: "0px"
                            }, paramsBridal.speed);
                            $moveRightPageAnim.css({
                                right: "-40px",
                                height: "280px",
                                bottom: "0px"
                            }).delay(paramsBridal.delay + paramsBridal.speed).animate({
                                right: "0px"
                            }, paramsBridal.speed);
                        }
                    }
                    $btnCloseBridal.delay(paramsBridal.delay).fadeOut(paramsBridal.speed);
                    $("#pageImg img").delay(paramsBridal.delay).fadeIn(paramsBridal.speed);
                }
            });
        }
        return _this;
    };
    _m_ = _super.bridal_anim;
})(WFJ.module, jQuery);

/*
 * callback
 */
(function(_super, $) {
    var _m_;
    _super.callback = function() {
        var _this = this;
        var $callbackSubmit = $("#callbackSubmit");
        // CALLBACK SUBMIT CALLBACK
        var callbackSubmitClick = function(e) {
            e.preventDefault();
            var $callbackForm = $("#callbackForm");
            if (checkForm($callbackForm[0])) {
                $.ajax({
                    type: "GET",
                    url: basehref + sitelocEncoded + "?page=ajax_callback&ajaxoutput=true&" + $callbackForm.serialize(),
                    data: {},
                    success: function(result) {
                        $("#callbackContent").addClass("success");
                    },
                    complete: function(result) {}
                });
            }
        };
        // SET EVENTS
        $callbackSubmit.unbind("click", callbackSubmitClick).bind("click", callbackSubmitClick);
        return _this;
    };
    _m_ = _super.callback;
})(WFJ.module, jQuery);

(function(_super, $) {
    var _m_;
    // TAGS WEBTRENDS
    // scat2 / prod / dl
    var tags_webtrends = {
        0: [ "FJ Camélia Galbé", "FJ Camélia Galbé_SpottedAt_view", "0" ],
        //
        1: [ "FJ Camélia Galbé", "FJ Camélia Galbé_SpottedAt_click", "50" ],
        //
        2: [ "FJ Camélia Galbé", "FJ Camélia Galbé_Specificities_view", "0" ],
        //
        3: [ "FJ Camélia Galbé", "FJ Camélia Galbé_Specificities_click", "50" ],
        //
        4: [ "FJ Camélia Galbé", "FJ Camélia Galbé_ChanelLogo_click", "50" ],
        //
        5: [ "FJ Camélia Galbé", "FJ Camélia Galbé_Country_click", "50" ],
        //
        6: [ "FJ Camélia Galbé", "FJ Camélia Galbé_GoToCollection_click", "50" ],
        //
        7: [ "FJ Camélia Galbé", "FJ Camélia Galbé_Map_click", "0" ],
        //
        8: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileHomepage_view", "0" ],
        //
        9: [ "FJ Camélia Galbé", "FJ Camélia Galbé_ChanelLogo_click", "50" ],
        //
        10: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileTheCollection_click", "50" ],
        //
        11: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileTheCollection_view", "0" ],
        //
        12: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileRing1_view", "0" ],
        //
        13: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileRing2_view", "0" ],
        //
        14: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileRing3_view", "0" ],
        //
        15: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileRing4_view", "0" ],
        //
        16: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobilePendant1_view", "0" ],
        //
        17: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobilePendant2_view", "0" ],
        //
        18: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileEarrings1_view", "0" ],
        //
        19: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileEarrings2_view", "0" ],
        //
        20: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileBracelet1_view", "0" ],
        //
        21: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileBracelet2_view", "0" ],
        //
        22: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileHeadJewel1_view", "0" ],
        //
        23: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileHeadJewel2_view", "0" ],
        //
        24: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileRing1Details_click", "50" ],
        //
        25: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileRing2Details_click", "50" ],
        //
        26: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileRing3Details_click", "50" ],
        //
        27: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileRing4Details_click", "50" ],
        //
        28: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobilePendant1Details_click", "50" ],
        //
        29: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobilePendant2Details_click", "50" ],
        //
        30: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileEarrings1Details_click", "50" ],
        //
        31: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileEarrings2Details_click", "50" ],
        //
        32: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileBracelet1Details_click", "50" ],
        //
        33: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileBracelet2Details_click", "50" ],
        //
        34: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileHeadJewel1Details_click", "50" ],
        //
        35: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileHeadJewel2Details_click", "50" ],
        //
        36: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileSpottedNear_click", "50" ],
        //
        37: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileSpottedNear_view", "0" ],
        //
        38: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileCurrentLocation_click", "50" ],
        //
        39: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileSearchSubmit_click", "50" ],
        //
        40: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileMap_click", "50" ],
        //
        41: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobileLegal_click", "50" ],
        //
        42: [ "FJ Camélia Galbé", "FJ Camélia Galbé_MobilePrivacy_click", "50" ]
    };
    _super.camelia_galbe = function() {
        // INIT LOCALE
        $phone = localeText.phone;
        $distance = localeText.distance;
        $mapText = localeText.map;
        $resultat = localeText.result;
        $resultats = localeText.results;
        $proximity = localeText.proximity;
        $loading = localeText.location_loading;
        $location = localeText.location;
        $location_error = localeText.location_error;
        $price_on_demand = localeText.price_on_demand;
        // INIT VARS
        var _this = this;
        if (DEVICE_TYPE == "mobile") {
            var $geolocationBtn = $("#geolocationBtn");
            var $countryList = $("#country_list");
            var $cityList = $("#city_list");
            var $cityFullList = $("#city_full_list");
            var $cityPlaceholder = $(".city_placeholder");
            var $storesSection = $(".stores");
            var $form = $(".stores form");
            var $specificities = $("section.specificities");
        } else {
            var $pins = $("#country_pins");
            var $map = $("#map_container");
            var $desktopResult = $("#country_result");
            var $countryResult = $(".country_zone");
            var $cityResult = $(".city_zone");
        }
        var wtMapClickID = 7;
        if (DEVICE_TYPE === "mobile") {
            wtMapClickID = 40;
        }
        var $resultTemplateDefault = "<article class='city_%CITYNAME%'> <strong>%NAME%</strong><br> %ADD1%, %ADD2%<br> %ZIP% %CITY% %STATE%<br> " + $phone + " : %PHONE%<br> <a href='%GMAPURL%' target='_blank' data-tag-id='" + wtMapClickID + "'>" + $mapText + "</a> <span>(" + $distance + " : %DISTANCE% KM)</span> </article>";
        var $resultTemplateUS = "<article class='city_%CITYNAME%'> <strong>%NAME%</strong><br> %ADD1%, %ADD2%<br> %CITY% %STATE% %ZIP% <br> " + $phone + " : %PHONE%<br> <a href='%GMAPURL%' target='_blank' data-tag-id='" + wtMapClickID + "'>" + $mapText + "</a> <span>(" + $distance + " : MI %DISTANCE%)</span> </article>";
        var $resultTemplateJP = "<article class='city_%CITYNAME%'> <strong>%NAME%</strong><br> %ADD1%, %ADD2%<br> " + $phone + " : %PHONE%<br> <a href='%GMAPURL%' target='_blank' data-tag-id='" + wtMapClickID + "'>" + $mapText + "</a> <span>(" + $distance + " : %DISTANCE% KM)</span> </article>";
        var $resultTemplateGB = "<article class='city_%CITYNAME%'> <strong>%NAME%</strong><br> %ADD1%, %ADD2%<br> %CITY% %ZIP%<br> " + $phone + " : %PHONE%<br> <a href='%GMAPURL%' target='_blank' data-tag-id='" + wtMapClickID + "'>" + $mapText + "</a> <span>(" + $distance + " : MI %DISTANCE%)</span> </article>";
        // SET DEFAULT VALUES
        var geolocationSearch = false;
        var tablet = false;
        // SET CALLBACKS
        var isTablet = function() {
            return tablet = $("#globaldiv").outerWidth() == 996;
        };
        var sizeElement = function() {
            if (tablet == isTablet()) {
                return;
            }
            tablet = isTablet();
            if (typeof jScrollPane != "undefined") {
                jScrollPane.scrollToY(0);
                jScrollPane.reinitialise();
            }
            if (DEVICE_TYPE != "mobile") {
                $(".pins").remove();
                generatePins();
            }
        };
        var geolocation = function(e) {
            if (navigator.geolocation) {
                // Webtrend
                _this.send_stats({
                    id: 38
                });
                $("#geolocationBtn span").text($loading);
                navigator.geolocation.getCurrentPosition(function g(position) {
                    // User Accept
                    geolocationSearch = true;
                    var hostWebservices = "http://uat-ws.chanel.com";
                    if (environment == "origin") {
                        hostWebservices = "http://ws.chanel.com";
                    }
                    var apiUrl = hostWebservices + "/storelocator/stores/full/" + locale + "/?main_divisions_id[1]=5&radius=1000&geoposition[lat]=" + position.coords.latitude + "&geoposition%5Blon%5D=" + position.coords.longitude;
                    $.ajax({
                        type: "GET",
                        url: apiUrl,
                        dataType: "JSON",
                        headers: {
                            Accept: "application/json"
                        },
                        success: function(data) {
                            var toSplice = [];
                            var countriesIdResponse = [];
                            $("#geolocationBtn span").text($location);
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].ischanel != 1) {
                                    toSplice.push(i);
                                } else {
                                    data[i].name = data[i].translations[0].name;
                                    data[i].adress1 = data[i].translations[0].address1;
                                    data[i].adress2 = data[i].translations[0].address2;
                                }
                                if ($.inArray(data[i].countryid, countriesIdResponse) == -1) {
                                    countriesIdResponse.push(data[i].countryid);
                                }
                            }
                            for (var i = 0; i < toSplice.length; i++) {
                                data.splice(toSplice[i], 1);
                            }
                            if ($.inArray(234, countriesIdResponse) || $.inArray(77, countriesIdResponse)) {
                                var dataFull = data;
                                apiUrl = hostWebservices + "/storelocator/stores/full/" + locale + "/?main_divisions_id[1]=1&radius=1000&geoposition[lat]=" + position.coords.latitude + "&geoposition%5Blon%5D=" + position.coords.longitude;
                                $.ajax({
                                    type: "GET",
                                    url: apiUrl,
                                    dataType: "JSON",
                                    headers: {
                                        Accept: "application/json"
                                    },
                                    success: function(data) {
                                        var toSplice = [];
                                        for (var i = 0; i < data.length; i++) {
                                            if ($.inArray(parseInt(data[i].id), stores_fashion_json[234]) != -1 || $.inArray(parseInt(data[i].id), stores_fashion_json[77]) != -1) {
                                                data[i].name = data[i].translations[0].name;
                                                data[i].adress1 = data[i].translations[0].address1;
                                                data[i].adress2 = data[i].translations[0].address2;
                                                dataFull.push(data[i]);
                                            }
                                        }
                                        for (var i = 0; i < toSplice.length; i++) {
                                            data.splice(toSplice[i], 1);
                                        }
                                        dataFull.sort(function(a, b) {
                                            return parseInt(a.distance) < parseInt(b.distance) ? -1 : 1;
                                        });
                                        showResultMobile();
                                        ajaxSuccess(dataFull);
                                    }
                                });
                            } else {
                                showResultMobile();
                                ajaxSuccess(data);
                            }
                        }
                    });
                }, function e() {
                    // User Decline
                    $("#geolocationBtn span").text($location);
                    alert($location_error);
                }, {
                    timeout: 15e3,
                    maximumAge: 6e4,
                    enableHighAccuracy: false
                });
            }
            e.preventDefault();
        };
        var getCountriesCities = function() {
            for (var key in storesBack) {
                var countryName = key;
                var countryId = storesBack[key].id;
                $countryList.append('<option value="' + countryId + '">' + countryName + "</option>");
                for (var keyCity in storesBack[key].cities) {
                    //var cityId = storesBack[key].cities[keyCity].id;
                    var cityName = keyCity;
                    var option = $("<option>", {
                        "class": "country_" + countryId,
                        value: countryName + "|" + cityName,
                        text: cityName
                    }).data("country_id", countryId);
                    $cityFullList.append(option);
                }
            }
        };
        var filterCityList = function() {
            $cityList.find("option").remove();
            $cityFullList.find("option.country_" + $(this).val()).each(function() {
                $cityList.append($(this).clone());
            });
            if ($(this).val() != "") {
                $cityPlaceholder.addClass("selectable");
            }
            $(this).next("span").text($cityList.find("option:first").text());
        };
        var updatePlaceholder = function(e) {
            var select = $(this).is("select") ? $(this) : $(this).parent();
            select.prev("span").text(select.find('option[value="' + select.val() + '"]').text());
        };
        var submitSelectForm = function(e) {
            e.preventDefault();
            var val = $cityList.val();
            if (val != undefined) {
                // Webtrend
                _this.send_stats({
                    id: 39
                });
                var cityVal = val.split("|");
                showResultMobile();
                ajaxSuccess(storesBack[cityVal[0]].cities[cityVal[1]].stores);
            }
        };
        var ajaxSuccess = function(data) {
            $("body").css({
                overflow: "auto"
            });
            $(".search_result").find("article").remove();
            if (data.length > 0) {
                generateResult(data);
            } else {
                $(".search_result").children("strong").find("span").text(0);
            }
        };
        var showResultMobile = function() {
            $(".search_result").addClass("displayed");
            $("html, body").animate({
                scrollTop: 230
            });
        };
        var generateResult = function(data) {
            switch (locale) {
              case "en_US":
                var tpl = $resultTemplateUS;
                break;

              case "ja_JP":
                var tpl = $resultTemplateJP;
                break;

              case "en_GB":
                var tpl = $resultTemplateGB;
                break;

              default:
                var tpl = $resultTemplateDefault;
                break;
            }
            for (i = 0; i < data.length; i++) {
                var output = tpl;
                output = output.replace("%CITYNAME%", data[i].cityname.replace(/ /g, "-").toLowerCase());
                output = output.replace("%NAME%", data[i].name);
                output = output.replace("%ADD1%", data[i].adress1);
                output = output.replace("%ADD2%", data[i].adress2 ? data[i].adress2 + "," : "");
                output = output.replace("%ZIP%", data[i].zipcode);
                if (data[i].countryid == "234") {
                    output = output.replace("%CITY%", data[i].cityname + ", ");
                } else {
                    output = output.replace("%CITY%", data[i].cityname);
                }
                output = output.replace("%STATE%", data[i].statename);
                output = output.replace("%PHONE%", data[i].phone);
                if (data[i].distance) {
                    var distance = parseFloat(data[i].distance).toFixed(2);
                    if (locale === "en_US" || locale === "en_GB") {
                        var distance = (parseFloat(data[i].distance) / 1.609).toFixed(2);
                    }
                    output = output.replace("%DISTANCE%", distance);
                }
                //output = output.replace('%GMAPURL%', "https://maps.google.com/?z=15&q="+ data[i].name+", "+ data[i].adress1+" "+data[i].adress2+", "+data[i].cityname );
                output = output.replace("%GMAPURL%", "http://maps.google.com/?q=" + data[i].latitude + "," + data[i].longitude);
                $(".search_result").append(output);
                if (!data[i].distance > 0) {
                    $(".search_result").find("article:last span").hide();
                }
            }
            var resultNumber = $(".search_result").find("article").length;
            var resultProximity = geolocationSearch ? $proximity : "";
            $(".search_result").children("strong").find("span:first").text(resultNumber);
            if (resultNumber < 2) {
                $(".search_result").children("strong").find("span:last").text($resultat + " " + resultProximity);
            } else {
                $(".search_result").children("strong").find("span:last").text($resultats + " " + resultProximity);
            }
            if (DEVICE_TYPE != "mobile") {
                $("#country_result").show();
                window.jScrollPane = $(".search_result").jScrollPane({
                    mouseWheelSpeed: 20
                }).data("jsp");
                $("#country_result").hide();
            }
            geolocationSearch = false;
            if (DEVICE_TYPE == "mobile") {
                $(window).off("resize");
            }
        };
        var generatePins = function() {
            var multiplier = tablet ? .79 : 1;
            // 0.79 is the scale between desktop (1226) and tablet (966)
            les_pins = [];
            for (var key in storesBack) {
                var countryName = key;
                var countryId = storesBack[key].id;
                var nbStore = storesBack[key].nb_stores;
                if (typeof stores[countryId] !== "object") {
                    continue;
                }
                var pins = $("<span>", {
                    "class": "pins",
                    css: {
                        top: stores[countryId].pins_top * multiplier,
                        left: stores[countryId].pins_left * multiplier
                    },
                    //'data-tag-id' : 2,
                    "data-country-id": countryId,
                    "data-country-name": countryName
                });
                var shop_s = nbStore > 1 ? localeText.shops : localeText.shop;
                var html_pins = "<strong>" + countryName + "</strong><br>" + nbStore + " " + shop_s;
                if (locale == "ru_RU") {
                    html_pins = "<strong>" + countryName + "</strong><br>" + shop_s + ": " + nbStore;
                }
                var overlay = $("<span>", {
                    html: html_pins,
                    "class": stores[countryId].direction
                });
                pins.append(overlay);
                //$pins.append(pins);
                les_pins.push(pins);
            }
            les_pins.sort(function(a, b) {
                return Math.random() > .5 ? 1 : -1;
            });
            nbPins = les_pins.length;
            nbPinsAppend = 0;
            displayPins(les_pins[0]);
        };
        var displayPins = function(le_pins) {
            $pins.append(le_pins);
            nbPinsAppend++;
            setTimeout(function() {
                if (nbPinsAppend < nbPins) {
                    displayPins(les_pins[nbPinsAppend]);
                }
            }, 40);
        };
        var generateStore = function() {
            var data = [];
            for (var key in storesBack) {
                for (var key2 in storesBack[key].cities) {
                    for (var i = storesBack[key].cities[key2].stores.length - 1; i >= 0; i--) {
                        data.push(storesBack[key].cities[key2].stores[i]);
                    }
                }
            }
            generateResult(data);
        };
        var showPins = function(e) {
            var flag = $(this).find("span");
            $(".pins span:animated").stop(true, true);
            if (!flag.is(":visible")) {
                flag.fadeIn(200);
            } else {
                flag.fadeOut(200);
            }
        };
        var clickPins = function(e) {
            // Webtrend
            _this.send_stats({
                id: 5
            });
            $(".jspContainer").height(275);
            var countryName = $(this).data("country-name");
            var country = $("<span>", {
                text: $(this).data("country-name")
            });
            $countryResult.append(country);
            for (var key in storesBack[countryName].cities) {
                var city = $("<a>", {
                    href: "#",
                    text: key + " (" + storesBack[countryName].cities[key].nb_stores + ")",
                    "data-city-name": storesBack[countryName].cities[key].stores[0].cityname.replace(/ /g, "-").toLowerCase()
                });
                $cityResult.append(city);
            }
            showMapResult();
            $cityResult.find("a:first").trigger("click");
            $("nav a:eq(1)").removeClass("active").on("click", backToMap);
            e.stopPropagation();
        };
        var closePins = function(e) {
            $(".pins span").fadeOut(200);
            e.preventDefault();
            e.stopPropagation();
        };
        var showMapResult = function() {
            $map.fadeOut(function() {
                $(".shop_zone").hide();
                $desktopResult.fadeIn(function() {
                    $(".shop_zone").show();
                    jScrollPane.reinitialise();
                });
                $(".pins span").hide();
            });
        };
        var switchCity = function(e) {
            $cityResult.find("a").removeClass("active");
            $(this).addClass("active");
            $(".search_result").find("article").hide();
            $(".search_result").find(".city_" + $(this).data("city-name")).show();
            if (typeof jScrollPane != "undefined") {
                jScrollPane.scrollToY(0);
                jScrollPane.reinitialise();
            }
            e.preventDefault();
        };
        var backToMap = function(e) {
            $(".pins span").removeAttr("style").hide();
            $("nav a:eq(1)").addClass("active").off("click");
            $desktopResult.fadeOut(function() {
                $map.fadeIn();
                $countryResult.find("span").remove();
                $cityResult.find("a").remove();
            });
        };
        var addScroll = function() {
            if (DEVICE_TYPE == "mobile") {
                return;
            }
            window.jScrollPane = $(".search_result").jScrollPane({
                mouseWheelSpeed: 20
            }).data("jsp");
            jScrollPane.reinitialise();
        };
        var callBackSlide = function() {
            // get price
            setTimeout(function() {
                if ($(".slide.active").data("ref")) {
                    $.ajax({
                        type: "GET",
                        headers: {
                            Accept: "application/json"
                        },
                        dataType: "JSON",
                        url: "/" + siteloc + "collection_product_detail?product_id=" + $(".slide.active").data("ref").toUpperCase() + "&products_ref=" + $(".slide.active").data("ref").toUpperCase() + "%2C&collection_id=" + $(".slide.active").data("collection").toUpperCase() + "&subcollection_id=" + $(".slide.active").data("category").toUpperCase() + "&maj=price",
                        success: function(data) {
                            var price = data.product[0].price;
                            if (price != "") {
                                if (price.indexOf("-") !== -1) {
                                    //                                    $('.slide.active .price').html($price_on_demand);
                                    $("#box-price .info_price").hide();
                                    $("#box-price hr").hide();
                                } else {
                                    $(".slide.active .price").html(price);
                                    $("#box-price .info_price").show();
                                    $("#box-price hr").show();
                                }
                            } else {
                                $(".slide.active #box-price").hide();
                                $("#box-price .info_price").hide();
                            }
                        }
                    });
                }
            }, 200);
            // reset more
            $(".slide .more").removeClass("deployed");
            $(".slide").css("marginTop", 0);
            $(".slide:not(.slide_text) .details_collection").hide();
            setTimeout(function() {
                // Manage Arrow
                if (!$(".slide_text").is(".active")) {
                    $(".slideshow-arrow-prev").show();
                } else {
                    $(".slideshow-arrow-prev").hide();
                }
                if ($(".slide.active", "#camelia_galbe_mobile").index() + 1 == $(".slide", "#camelia_galbe_mobile").length) {
                    $(".slideshow-arrow-next").hide();
                } else {
                    $(".slideshow-arrow-next").show();
                }
            }, 100);
        };
        var collectionMore = function(e) {
            if ($(this).is(".deployed")) {
                $(this).removeClass("deployed").siblings(".details_collection").fadeOut();
            } else {
                $(this).addClass("deployed").siblings(".details_collection").fadeIn();
                $(".slide.active").height(_this.visibleScreen).css("overflow", "auto").animate({
                    scrollTop: 1e3
                }, 600);
            }
            e.preventDefault();
        };
        var afterInitSlider = function() {
            $(".slider_collection").swipe({
                swipeLeft: function(event, direction) {
                    swipeSlider(direction);
                },
                swipeRight: function(event, direction) {
                    swipeSlider(direction);
                },
                swipeUp: function(event, direction) {
                    swipeSlider(direction);
                },
                allowPageScroll: "vertical",
                threshold: 20
            });
            _this.visibleScreen = $(window).outerHeight() - $("header").outerHeight() - $("nav").outerHeight();
            // header 68, nav 56
            $(".slideshow-arrow-prev, .slideshow-arrow-next").detach().appendTo(".specificities");
            $(".slider_collection .slide .more").on("click", collectionMore);
            $(".slider_collection .slide").show();
            // La hauteur utile - la hauteur d'une image à 100% doit etre supérieure à 45px pour voir le titre et le lien MORE.
            if (_this.visibleScreen - $(window).outerWidth() / .93 < 45) {
                // 0.93 is scale of image 640*682
                $(".slider_collection .slide img").css("width", (_this.visibleScreen - 45) * .93 + "px");
            }
        };
        var swipeSlider = function(direction) {
            if (direction == "left") {
                $(".slideshow-arrow-next").trigger("click");
            } else if (direction == "right") {
                $(".slideshow-arrow-prev").trigger("click");
            }
            if ($(".slide.active .more.deployed").length === 0) {
                if (direction == "up") {
                    $(".slide.active .more:not(.deployed)").trigger("click");
                }
            }
        };
        var adjustLegals = function() {
            if ($("section.home").length === 1) {
                var wHeight = $(window).height();
                var wWidth = $(window).width();
                var visibleScreen = $(window).outerHeight() - $("header").outerHeight() - $("nav").outerHeight();
                if (wHeight > 480) {
                    imgHeight = wWidth / .87;
                    if (imgHeight < visibleScreen) {
                        $(".legals").css("marginTop", visibleScreen - imgHeight + 5);
                    }
                }
            }
            if ($("section.stores").length === 1) {
                wHeight = $(window).height();
                if (wHeight > 480) {
                    initialMT = $(".legals:not(.details_collection .legals)").css("marginTop").split("px")[0];
                    initialMT = parseInt(initialMT, 10);
                    $(".legals").css("marginTop", initialMT + wHeight - 480);
                }
            }
        };
        var adjustSpecificitiesText = function() {
            var wHeight = $(window).height();
            var visibleScreen = $(window).height() - $("header").outerHeight() - $("nav").outerHeight();
            // header 68, nav 56
            //alert( $(window).height()+" - "+$('header').outerHeight()+" - "+$('nav').outerHeight()+" = "+visibleScreen );
            var pHeight = 0;
            $(".slide_text p").each(function() {
                pHeight += $(this).height();
            });
            // alert(pHeight);
            margin = (visibleScreen - pHeight) / ($(".slide_text p").length + 1);
            //alert(margin);
            $(".slide_text p").css({
                marginTop: margin
            });
            $(".slide_text p:not(:last)").css({
                marginBottom: margin
            });
        };
        // WEBTRENDS FUNCTION
        var trackEvents = function(e) {
            var id = "" + $(this).data("tag-id");
            $(id.split(",")).each(function(i, el) {
                if (el >= 0) send_stats({
                    id: el
                });
            });
        };
        var trackViews = function() {
            var $tagDirect = $("[data-tag-direct]");
            $tagDirect.each(function() {
                var idView = $(this).data("tag-direct");
                if (idView >= 0) send_stats({
                    id: idView
                });
            });
        };
        // SET EVENTS
        if (typeof storesBack != "undefined") {
            tablet = isTablet();
            if (DEVICE_TYPE == "mobile") {
                $geolocationBtn.on("click", geolocation);
                $countryList.on("change", filterCityList);
                $countryList.one("click", filterCityList);
                $countryList.one("click", updatePlaceholder);
                $form.find("select").on("change", updatePlaceholder);
                $form.on("submit", submitSelectForm);
                getCountriesCities();
            } else {
                generatePins();
                generateStore();
                $pins.on("click", ".pins", clickPins);
                $cityResult.on("click", "a", switchCity);
                $countryResult.on("click", "a, span", backToMap);
                $pins.on("mouseenter mouseleave", ".pins", showPins);
                $map.on("click", closePins);
                $(window).on("resize", sizeElement);
            }
        }
        if (DEVICE_TYPE == "mobile") {
            $(window).off("resize");
            if ($("section.specificities").length) {
                $(".slide_text").height($(window).outerHeight() - $("header").outerHeight() - $("nav").outerHeight());
                $(".slider_collection").slideshow({
                    shownav: false,
                    controls: true,
                    callback: callBackSlide,
                    callsync: function($slides, oldIndex, newIndex) {
                        if (newIndex != 0) {
                            // Webtrend
                            // View index start at 12, first valid index (slideshow .slide) start at 1.
                            _this.send_stats({
                                id: 11 + newIndex
                            });
                        }
                    },
                    speed: 400,
                    loop: false
                });
                $(".slideshow-arrow-prev").hide();
                callBackSlide();
                afterInitSlider();
                setTimeout(function() {
                    adjustSpecificitiesText();
                    $(".slider_collection").fadeTo(1e3, 1);
                }, 2e3);
            }
            adjustLegals();
        } else {
            setTimeout(function() {
                $("p,div", "section#specificities").fadeIn(1e3);
            }, 700);
        }
        if ($(".camelia_press").length > 0) {
            $(".footer_presse li a").on("click", function() {
                var cssClass = $(this).attr("class").replace("_link", "");
                $(".popin_presse." + cssClass).show();
                if ($(this).is(".presse_mentions_link")) {
                    $(".mentions_legales").jScrollPane({
                        mouseWheelSpeed: 20,
                        verticalGutter: 20
                    }).data("jsp");
                }
            });
            $(".popin_presse .close").on("click", function() {
                $(this).closest(".popin_presse").hide();
            });
        }
        // $("#camelia_galbe, #camelia_galbe_mobile").find("[data-tag-id]").on("click", trackEvents);
        // trackViews();
        _this.set_track_events();
        return _this;
    };
    _m_ = _super.camelia_galbe;
    _m_.prototype.send_stats = function send_stats(data) {
        if (!data.id in tags_webtrends) return;
        var platform = "Desktop";
        // Mobile / Tablet
        if (isMobile()) {
            platform = "Mobile";
        } else if (isTablet()) {
            platform = "Tablet";
        }
        var ch_scat1 = "FJ Camélia Galbé-<<Platform>>";
        var ch_scat2 = encodeURI(tags_webtrends[data.id][0]);
        var ch_prod = encodeURI(tags_webtrends[data.id][1]);
        var dl = encodeURI(tags_webtrends[data.id][2]);
        ch_scat1 = ch_scat1.replace("<<Platform>>", platform);
        stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, ch_scat2, ch_prod, dl);
    };
    _m_.prototype.set_track_events = function set_track_events() {
        var _this = this;
        var $btnTrack = $("body").find("[data-tag-id]");
        var $trackView = $("body").find("[data-tag-direct]");
        var trackEvents = function trackEvents(e) {
            var $this = $(this);
            e.preventDefault();
            if ($this.attr("target") === "_blank") {
                window.open($this.attr("href"));
            } else {
                setTimeout(function() {
                    location.href = $this.attr("href");
                }, 1e3);
            }
            e.stopPropagation();
            var id = "" + $(this).data("tag-id");
            $(id.split(",")).each(function(i, el) {
                if (el >= 0) _this.send_stats({
                    id: el
                });
            });
        };
        var trackEventsView = function trackEventsView() {
            //            var $this = $(this);
            var $tagDirect = $("[data-tag-direct]");
            $tagDirect.each(function() {
                var idView = $(this).data("tag-direct");
                if (idView >= 0) _this.send_stats({
                    id: idView
                });
            });
        };
        $("#centerdiv").on("click", "[data-tag-id]", trackEvents);
        trackEventsView();
        return _this;
    };
})(WFJ.module, jQuery);

/*
 * coco
 */
(function(_super, $) {
    var _m_;
    var _support = {
        hashChange: "onhashchange" in window && (document.documentMode === undefined || document.documentMode > 7),
        //IMPORTANT: IE8+ in compatibility mode IE7 say that it support hashChange
        isTouch: $("html.touch").length
    };
    var $scrollable = $(".scrollable");
    _super.coco = function() {
        console.log("module coco loaded");
        var objDraggable;
        var indexActive = -1;
        var lockHashChange = false;
        var scrolltimer;
        var calculateDestination = function(target) {
            var $target = $(target);
            var toLeft = -1 * $target.position().left + $scrollable.width() / 2 - $target.width() / 2;
            var toTop = -1 * $target.position().top + $scrollable.height() / 2 - $target.height() / 2;
            if (WFJ.resVersion === "Small") {
                toLeft += $target.data("leftsmall");
                toTop += $target.data("topsmall");
            } else {
                // "Big"
                toLeft += $target.data("left");
                toTop += $target.data("top");
            }
            if (target === ".collection-wrapper" && $("html").hasClass("ja_JP")) {
                //EXCEPTION ja_JP
                toTop += 120;
            }
            return {
                x: toLeft,
                y: toTop
            };
        };
        var activateRubriqueOnDrag = function(dragX, dragY) {
            $(".coco-wrapper .coco-bloc").each(function(index) {
                var posX_left = $(this).position().left - dragX;
                var posY_top = $(this).position().top - dragY;
                var posX_right = posX_left + $(this).width();
                var posY_bottom = posY_top + $(this).height();
                var centerX = $scrollable.width() / 2;
                var centerY = $scrollable.height() / 2;
                if (indexActive != index && posX_left <= centerX && posX_right >= centerX && posY_top <= centerY && posY_bottom >= centerY) {
                    //if (_support.hashChange) {
                    lockHashChange = true;
                    location.hash = $(this).data("hash");
                    //}
                    $(".coco-menu a").css("color", "");
                    $(".coco-menu a:eq(" + index + ")").css("color", "#fff");
                    indexActive = index;
                    webTrendsAnalytics($(this).data("track"));
                }
            });
        };
        var getHashReference = function(hashInURL) {
            var customHash = null;
            for (var i = 0, lengthHashs = anchorsCoco.length; i < lengthHashs; i++) {
                if (anchorsCoco[i].hasOwnProperty(encodeURIComponent("#" + hashInURL))) {
                    customHash = anchorsCoco[i][encodeURIComponent("#" + hashInURL)];
                    break;
                }
            }
            return customHash;
        };
        var onHashChange = function() {
            if (!lockHashChange) {
                var hash = window.location.hash.substr(1), target = null, hashReference = null;
                if (hash !== "") {
                    hashReference = getHashReference(hash);
                    if (hashReference === null) {
                        hashReference = "collection";
                    }
                    target = hashReference + "-wrapper";
                    if (target) {
                        $(".coco-menu a").css("color", "");
                        $('.coco-menu a[data-target="' + target + '"]').css("color", "#fff");
                        var destination = calculateDestination("." + target);
                        if (_support.isTouch) {
                            $scrollable.animate({
                                scrollLeft: -1 * destination.x,
                                scrollTop: -1 * destination.y + 40
                            }, 2e3);
                        } else {
                            //TODO Draggable.update ? => ca n'a pas l'air d'être utile (se renseigner sur la fonction update)
                            TweenMax.to(".coco-wrapper", 2, {
                                x: destination.x,
                                y: destination.y,
                                z: 1
                            });
                        }
                    }
                } else {}
            }
        };
        var defautRubrique = "collection-wrapper";
        if (window.location.hash) {
            var hash = window.location.hash.substr(1), hashReference = null;
            hashReference = getHashReference(hash);
            if ($("." + hashReference + "-wrapper").length) {
                defautRubrique = hashReference + "-wrapper";
            }
        }
        var defautDestination = calculateDestination("." + defautRubrique);
        $(".coco-menu a").css("color", "");
        $('.coco-menu a[data-target="' + defautRubrique + '"]').css("color", "#fff");
        if (_support.isTouch) {
            // Si le device gère le touch, on laisse une simple div scrollable pour simuler du drag & drop
            $scrollable.scrollLeft(-1 * defautDestination.x).scrollTop(-1 * defautDestination.y + 40);
            // Sur tablet il y a un décalage de 40px (je ne sais pas pourquoi)
            $scrollable.on("scroll", function() {
                var scrollX = $scrollable.scrollLeft();
                var scrollY = $scrollable.scrollTop();
                activateRubriqueOnDrag(scrollX, scrollY);
                clearTimeout(scrolltimer);
                scrolltimer = setTimeout(function() {
                    lockHashChange = false;
                }, 100);
            });
            $(".coco-wrapper").css("visibility", "visible");
        } else {
            // Si le device ne gère pas le touch, on utilise la lib GSAP Draggable pour faire du drag & drop
            var minX = $scrollable.width() - $(".coco-wrapper").width() + 100;
            // On rajoute un décalage de 100px pour ne pas voir le fond noir lors des rebonds au bord de la map au drag
            var minY = $scrollable.height() - $(".coco-wrapper").height() + 100;
            objDraggable = Draggable.create(".coco-wrapper", {
                type: "x,y",
                cursor: "url(" + basehref + path_site + "/assets/coco/img/cursor_3.png), move",
                zIndexBoost: false,
                dragClickables: false,
                edgeResistance: .75,
                dragResistance: .2,
                bounds: {
                    minX: minX,
                    maxX: -230,
                    minY: minY,
                    maxY: -50
                },
                throwProps: true,
                onThrowComplete: function() {
                    activateRubriqueOnDrag(-1 * this.x, -1 * this.y);
                    setTimeout(function() {
                        lockHashChange = false;
                    }, 0);
                },
                onDrag: function() {
                    activateRubriqueOnDrag(-1 * this.x, -1 * this.y);
                }
            });
            TweenMax.set(".coco-wrapper", {
                x: defautDestination.x,
                y: defautDestination.y,
                z: 1,
                onComplete: function() {
                    $(".coco-wrapper").css("visibility", "visible");
                }
            });
            $("body").on("window:changeresize", function() {
                if (WFJ.oldVersion != WFJ.resVersion) {
                    var minX = $scrollable.width() - $(".coco-wrapper").width() + 100;
                    var minY = $scrollable.height() - $(".coco-wrapper").height() + 100;
                    objDraggable[0].applyBounds({
                        minX: minX,
                        maxX: -230,
                        minY: minY,
                        maxY: -50
                    });
                }
            });
        }
        if (_support.hashChange) {
            $(window).on("hashchange", onHashChange);
        } else {
            //_support.hashChange == false
            // Sous IE7 le hashChange ne fonctionne pas, on gère donc les click sur les liens du menu
            $(".coco-menu li .prevent").on("click", function(e) {
                //e.preventDefault();
                $(".coco-menu a").css("color", "");
                $(e.currentTarget).css("color", "#fff");
                var destination = calculateDestination("." + $(e.currentTarget).data("target"));
                if (_support.isTouch) {
                    $scrollable.animate({
                        scrollLeft: -1 * destination.x,
                        scrollTop: -1 * destination.y + 40
                    }, 2e3);
                } else {
                    //TODO Draggable.update ? => ca n'a pas l'air d'être utile (se renseigner sur la fonction update)
                    TweenMax.to(".coco-wrapper", 2, {
                        x: destination.x,
                        y: destination.y,
                        z: 1
                    });
                }
            });
        }
        //AUDIO
        var players;
        audiojs.events.ready(function() {
            players = audiojs.createAll();
        });
        window.webtrendsAsyncInit = function() {
            $(window).trigger("webtrendsloaded");
        };
        (function() {
            var s = document.createElement("script");
            s.async = true;
            s.src = "http://www.chanel.com/js/libs/webtrends.js";
            var s2 = document.getElementsByTagName("script")[0];
            s2.parentNode.insertBefore(s, s2);
        })();
        function webTrendsAnalytics(track) {
            if (typeof track !== "object") {
                track = JSON.parse(track);
            }
            for (var key in track) {
                if (track.hasOwnProperty(key)) {
                    var subkey = key.split(".");
                    if (subkey.length > 1) {
                        dcs[subkey[0]][subkey[1]] = track[key];
                    } else {
                        dcs[key] = track[key];
                    }
                }
            }
            dcs.track();
        }
        $(window).on("webtrendsloaded", function() {
            webTrendsAnalytics(wt_page_view);
        });
        $("a[data-track]").on("click", function() {
            webTrendsAnalytics($(this).data("track"));
        });
        webtrendsAsyncInit();
    };
    _m_ = _super.coco;
})(WFJ.module, jQuery);

/*
 * collection
 */
(function(_super, $) {
    var _m_;
    var _scrollAllowed = true;
    _super.collection = function() {
        // INIT VARS
        var _this = this;
        var $window = $(window);
        var $centerblock = $("#centerblock");
        var $collections = $(".collections");
        var $visionneuseBtn = $(".more_view");
        var $closeVisionneuseBtn = $("#close-visionneuse");
        var $addEcrinClick = $(".ico_favorite");
        var $shareClick = $(".ico_share");
        var $filmClick = $(".inner_visuel");
        var $stickyNav = $(".sticky-nav");
        var $linkStickynav = $stickyNav.find("a");
        var $moreButton = $(".more-button > span");
        var $lessButton = $(".less-button");
        var readMoreSelector = ".read_more";
        var readMoreBtns = ".read_more_links";
        var $toggleBtns = $(".toggle_btns");
        var $changeSlideshow = $(".changeslideshow a");
        var $slideNext = $(".slide-next");
        var $slidePrev = $(".slide-prev");
        var $toggleCookie = $(".toggle_cookie");
        var $anchorLink = $(".anchor-link");
        var $desc = $(".details_collection .description .desc");
        var $starSelectProduct = $(".prd_details .ico_list .ico_favorite");
        var jsonresponse;
        var product_list;
        var ref = $("input.ref").val();
        var $prdInfos = $(".details_collection .product");
        var $closeprdInfos = $(".details_collection .close-prd");
        var $backBtn = $(".back-btn a");
        var $popinAddEcrin = $("#popinAddEcrin");
        var $labelIcoFavorite = $(".ico-1 .label");
        var isProductPage = $(".prd_details").length > 0;
        // SET ANCHOR LINK
        var firstBlock, secondBlock;
        if ($(".details_collection").length > 0) {
            firstBlock = $(".details_collection").children("div").eq(0).attr("id");
            if (!firstBlock) {
                firstBlock = $(".details_collection .list > div[id]").eq(0).attr("id");
            }
        } else if ($(".prd_details").length > 0) {
            firstBlock = $(".prd_details").children("div").eq(0).attr("id");
            secondBlock = $(".prd_details").children("div").eq(1).attr("id");
            if (secondBlock) {
                $(".anchor-link.fixedBottom").attr("href", "#" + secondBlock);
            } else {
                $(".anchor-link.fixedBottom").hide();
            }
        }
        $(".anchor-link.fixedTop").attr("href", "#" + firstBlock);
        var api;
        if (DEVICE_TYPE === "desktop") {
            // SET DEFAULT VALUES
            api = $collections.jScrollPane({
                autoReinitialise: true,
                autoReinitialiseDelay: 20,
                mouseWheelSpeed: 100,
                animateScroll: DEVICE_TYPE === "desktop" ? false : true,
                animateDuration: DEVICE_TYPE === "desktop" ? 300 : 800,
                animateEase: DEVICE_TYPE === "desktop" ? "linear" : "easeInOutQuart",
                verticalGutter: 0
            }).data("jsp");
        } else if (DEVICE_TYPE === "tablet") {
            api = $collections.niceScroll({
                cursorcolor: "#FFFFFF",
                cursorwidth: "6px",
                cursorborderradius: 0,
                cursorborder: "0",
                autohidemode: false,
                hwacceleration: true,
                enabletranslate3d: true,
                scrollspeed: 200,
                mousescrollstep: 200,
                preventmultitouchscrolling: true,
                smoothscroll: true,
                zindex: 999
            });
            $collections.on("scroll", function() {
                changeAnchorSticky();
                changeStickyNav();
            });
            window.setTimeout(function() {
                changeStickyNav();
            }, 100);
        }
        /*if (DEVICE_TYPE === 'tablet') {
            // Prevent iPad bounce
            $(document).on('touchmove', function (e) {
                e.preventDefault();
            });
        }*/
        $("html").on("mousewheel", function(e, delta, deltaX, deltaY) {
            e.preventDefault();
            api.scrollByY(-deltaY * 100);
        });
        // Replace text by logo img (SEO)
        var h1 = $("h1");
        if (h1.length > 0 && h1.hasClass("img-replacement")) {
            h1.empty().append("<img>");
            h1.find("img").attr("src", h1.data("img-src")).attr("alt", h1.data("img-alt")).addClass("logo").attr("title", h1.data("img-title"));
            h1.removeClass("img-replacement");
        }
        //INIT SLIDESHOW
        $("#slideshow-prd .slideshow").each(function() {
            $(this).slideshow({
                prefix: "prd",
                // prefix CSS
                autoslide: false,
                interval: 4e3,
                // interval de l'autoslide
                shownav: false,
                //show the bullet-navigation
                controlWrapper: $(".more-product"),
                preview: false,
                control: false,
                //show right and left arrow controls
                loop: false,
                nbClone: 0
            });
        });
        var slideshowPrdInit = function() {
            var slideshowActive = $("#slideshow-prd .slideshow:visible");
            if ($("#slideshow-prd .slideshow:visible li").length <= 1) {
                $("#slideshow-prd").siblings(".slide-prev").hide();
                $("#slideshow-prd").siblings(".slide-next").hide();
            } else {
                if (slideshowActive.data("slideshow").activeIndex == 0) {
                    $("#slideshow-prd").siblings(".slide-prev").hide();
                    $("#slideshow-prd").siblings(".slide-next").show();
                }
            }
        };
        var onResize = function() {
            //Placement Sticky Nav
            var stickyNavW = $stickyNav.width(), stickyNavH = $stickyNav.height(), diffWidth = $(window).width() - $("#globaldiv").width(), positionRightSticky = (DEVICE_TYPE === "tablet" ? diffWidth : diffWidth / 2) + 18, positionTopSticky = ($(window).height() - stickyNavH) / 2 - 15;
            $stickyNav.css({
                right: positionRightSticky,
                top: positionTopSticky
            }).show();
            //hack fullscreen firefox
            // if (screen.width == window.innerWidth) {
            //     $stickyNav.css({'right': '350px', 'top': '442px'}).show();
            // }
            if (DEVICE_TYPE === "tablet") {
                api.resize();
            }
        };
        var openVisionneuse = function(e) {
            $("#slideshow-visionneuse .slideshow").slideshow({
                prefix: "bang",
                // prefix CSS
                speed: 800,
                method: "animate",
                //method of animation (animate, transition, fx...)
                easing: "swing",
                autoslide: false,
                interval: 4e3,
                // interval de l'autoslide
                shownav: true,
                //show the bullet-navigation
                navWrapper: null,
                //selector || DOM element
                preview: false,
                control: true,
                //show right and left arrow controls
                loop: true,
                nbClone: 1
            });
            if ($(this).hasClass("others_view")) {
                $("#slideshow-visionneuse .slideshow").data("slideshow").slideTo(1, false, false);
            } else {
                $("#slideshow-visionneuse .slideshow").data("slideshow").slideTo(0, false, false);
            }
            $(".visionneuse").show();
        };
        var closeVisionneuse = function() {
            $(".visionneuse").hide();
        };
        var stickyTitles = function(stickies) {
            var thisObj = this;
            thisObj.load = function() {
                stickies.each(function() {
                    var thisSticky = $(this).wrap('<div class="follow-wrap" />');
                    thisSticky.parent().height(thisSticky.outerHeight() + 10);
                    $.data(thisSticky[0], "pos", thisSticky.offset().top);
                });
                if (DEVICE_TYPE === "desktop") {
                    $(window).off("scroll.stickies").on("scroll.stickies", function() {
                        thisObj.scroll();
                    });
                } else if (DEVICE_TYPE === "tablet") {
                    $collections.on("scroll", function() {
                        thisObj.scroll();
                    });
                }
            };
            thisObj.scroll = function() {
                var StickyToFix, posY, thisSticky, pos, $parentCat, posEnd;
                if (DEVICE_TYPE === "desktop") {
                    posY = api.getContentPositionY();
                } else if (DEVICE_TYPE === "tablet") {
                    posY = api.getScrollTop();
                }
                stickies.each(function(i) {
                    thisSticky = $(this);
                    pos = thisSticky.parent(".follow-wrap").position().top;
                    if (DEVICE_TYPE === "tablet") {
                        pos += api.getScrollTop();
                    }
                    $parentCat = thisSticky.closest(".cat");
                    posEnd = pos + $parentCat.height() - (globalDivHeight < 600 ? 120 : 220);
                    if (pos <= posY && posY <= posEnd) {
                        StickyToFix = thisSticky;
                        return false;
                    }
                });
                if (StickyToFix !== undefined && StickyToFix.hasClass("open")) {
                    stickies.not(StickyToFix).css({
                        position: "relative",
                        top: 0
                    });
                    var globalDivHeight = $("#globaldiv").height();
                    if (globalDivHeight < 600) {
                        StickyToFix.css({
                            position: "fixed",
                            top: ($window.height() - globalDivHeight) / 2 + "px"
                        });
                    } else {
                        StickyToFix.css({
                            position: "fixed",
                            top: ($window.height() - globalDivHeight) / 2 + 5 + "px"
                        });
                    }
                    StickyToFix.css("width", $(".details_collection").width() - parseInt(StickyToFix.css("padding-left")) * 2);
                    if (StickyToFix.find(".less-button").length === 0) {
                        $(".less-button").css("display", "block");
                    }
                } else {
                    stickies.css("position", "static");
                }
                var cat = $(thisObj).closest(".cat");
                $(".details-collection-subtitle").each(function() {
                    if ($(this).hasClass("open") && $(this).css("position") === "fixed") {
                        $(this).children(".less-button").addClass("active").removeClass("not-active");
                    } else {
                        $(this).children(".less-button").removeClass("active");
                    }
                });
            };
        };
        //new stickyTitles($(".subtitle")).load();
        new stickyTitles($(".details-collection-subtitle")).load();
        var changeStickyNav = function() {
            var posY, $rubrique, rubriquePosTop;
            if (DEVICE_TYPE === "desktop") {
                posY = api.getContentPositionY();
            } else if (DEVICE_TYPE === "tablet") {
                posY = api.getScrollTop();
            }
            $linkStickynav.removeClass("active").addClass("only-bullet");
            $linkStickynav.each(function() {
                $rubrique = $($(this).attr("href"));
                if (DEVICE_TYPE === "desktop") {
                    rubriquePosTop = $rubrique.position().top;
                } else if (DEVICE_TYPE === "tablet") {
                    rubriquePosTop = api.getScrollTop() + $rubrique.position().top - 34;
                }
                if (rubriquePosTop - posY <= $centerblock.outerHeight() / 2 && rubriquePosTop - posY + $rubrique.outerHeight() >= $centerblock.outerHeight() / 2) {
                    $(this).addClass("active").removeClass("only-bullet");
                }
            });
        };
        var clickStickyNav = function(e) {
            if (!_scrollAllowed) {
                return false;
            }
            _scrollAllowed = false;
            setTimeout(function() {
                _scrollAllowed = true;
            }, 300);
            e.preventDefault();
            var hash = $(this).attr("href").substring(1), positionDiv = $("#" + hash).position().top;
            if (hash) {
                if (DEVICE_TYPE === "desktop") {
                    api.scrollTo(hash, positionDiv, true);
                } else if (DEVICE_TYPE === "tablet") {
                    api.doScrollTop(api.getScrollTop() + positionDiv, 100);
                }
            }
        };
        var changeAnchorSticky = function(e) {
            var posY, positionRight = $(window).width() - ($centerblock.offset().left + $centerblock.outerWidth()), positionTop = $(window).height() - $centerblock.offset().top - $centerblock.outerHeight();
            positionBottom = $(window).height() - $centerblock.offset().top;
            if (DEVICE_TYPE === "desktop") {
                posY = api.getContentPositionY();
            } else if (DEVICE_TYPE === "tablet") {
                posY = api.getScrollTop();
            }
            if (posY >= $centerblock.outerHeight() - 90) {
                $(".anchor-link.fixedTop").removeClass("anchor-hidden").css({
                    top: positionTop + 10,
                    right: positionRight + 28
                });
                $(".anchor-link.fixedBottom").addClass("anchor-hidden");
            } else {
                $(".anchor-link.fixedTop").addClass("anchor-hidden");
                $(".anchor-link.fixedBottom").removeClass("anchor-hidden");
            }
        };
        var initCheckEcrin = function() {
            var allFavorite = $(".ico_favorite");
            $(allFavorite).each(function() {
                var ref = $(this).data("ref");
                var isInEcrin = WFJ.ecrin.checkInEcrin(ref);
                if (isProductPage) {
                    if (isInEcrin) {
                        $labelIcoFavorite.html($addEcrinClick.data("remove"));
                    } else {
                        $labelIcoFavorite.html($addEcrinClick.data("add"));
                    }
                }
                if (isInEcrin) {
                    $(this).addClass("selected");
                    if (isProductPage) {
                        $(".link-ecrin").addClass("highlight");
                    }
                    return;
                }
            });
        };
        var addEcrinClick = function(e) {
            e.preventDefault();
            var ref = $(this).data("ref");
            if ($(this).hasClass("selected")) {
                $(this).removeClass("selected");
                $(".link-ecrin").removeClass("highlight");
                WFJ.ecrin.deleteFromEcrin(ref, section);
                get_num_ecrin();
                $labelIcoFavorite.html($addEcrinClick.data("add"));
            } else {
                var isInEcrin = WFJ.ecrin.checkInEcrin(ref);
                if (isInEcrin) {
                    return;
                }
                $(".link-ecrin").addClass("highlight");
                $(this).addClass("selected");
                WFJ.ecrin.add(ref, section);
                $labelIcoFavorite.html($addEcrinClick.data("remove"));
            }
            get_num_ecrin();
        };
        var shareClick = function(e) {
            e.preventDefault();
            var $loader = $("#chargement");
            var $popin = $("#popin");
            var $inline_popup = $("#inline_popup");
            $loader.show();
            var urlplus = "";
            if ($("#activeList").length) {
                urlplus = "&section=" + $("#activeList").val();
            }
            $.ajax({
                type: "GET",
                url: "/" + sitelocEncoded + "partager_product?level1=" + level1 + urlplus,
                data: {
                    id: $("#centerblock").data("ref"),
                    collection: $("#centerblock").data("collection"),
                    category: $("#centerblock").data("category")
                },
                success: function(result) {
                    $popin.html(result).removeClass().addClass("partagerPopin").show();
                    $inline_popup.show();
                    $loader.hide();
                },
                complete: function(result) {
                    $("#closePopinBtn").bind("click", function(e) {
                        e.preventDefault();
                        $inline_popup.hide();
                        $(".mask").hide();
                    });
                    WFJ.getDataController(false);
                }
            });
        };
        var partageBtnClick_shareClick = function shareClick(e) {
            e.preventDefault();
            var level1 = $("#level1").val();
            var urlplus = "";
            //$loader.show();
            if ($("#activeList").length) {
                urlplus = "&section=" + $("#activeList").val();
            }
            $.ajax({
                type: "GET",
                url: "/" + sitelocEncoded + "partager_product?level1=" + level1 + urlplus,
                data: {
                    id: $("#product_ref").val(),
                    collection: $("#collectionRef").val(),
                    category: $("#categoryRef").val()
                },
                success: function(result) {},
                complete: function(result) {
                    /*                    $("#closePopinBtn").bind("click", function(e) {
                        e.preventDefault();
                        $inline_popup.hide();
                    })

                    $("#commentaire").bind("keypress", function(e) {
                        var maximum = 250; // Nbre de caractères
                        var $champ = $("#commentaire");
                        var $indic = $("#indicateur");

                        if ($champ.val().length > maximum)
                            $champ.val($champ.val().substring(0, maximum));
                        $indic.removeClass('indicateur-red');
                    });*/
                    //$loader.hide();
                    WFJ.getDataController(false);
                }
            });
        };
        var viewFilmClick = function(e) {
            $(this).css("display", "none");
            $(".playerWrapper").css("display", "inline-block");
            WFJ.module.ooyala.player.init({
                context: "collections"
            });
            var video = $(".playerContainer object");
            setTimeout(function() {
                fullScreenVideo(video);
            }, 1e3);
        };
        var fullScreenVideo = function(elem) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        };
        var changeProductSlideshow = function() {
            $changeSlideshow.removeClass("active");
            $(this).addClass("active");
            var $selectedSlideshow = $("#slideshow-prd .slideshow"), index = $changeSlideshow.index(this), slideshowActive = $selectedSlideshow.eq(index);
            $selectedSlideshow.removeClass("active");
            $selectedSlideshow.eq(index).addClass("active");
            slideshowActive.data("slideshow").slideTo(0, false, false);
            $("#slideshow-prd").siblings(".slide-prev").hide();
            if (slideshowActive.data("slideshow").nbSlides <= 1) {
                $("#slideshow-prd").siblings(".slide-next").hide();
            } else {
                $("#slideshow-prd").siblings(".slide-next").show();
            }
        };
        var slideNext = function() {
            var slideshowActive = $("#slideshow-prd .slideshow:visible");
            slideshowActive.data("slideshow").slideNext();
            if (slideshowActive.data("slideshow").activeIndex === slideshowActive.data("slideshow").nbSlides - 2) {
                $(this).hide().end().siblings(".slide-prev").show();
            } else {
                $(this).show();
            }
            $(this).siblings(".slide-prev").show();
        };
        var slidePrev = function() {
            var slideshowActive = $("#slideshow-prd .slideshow:visible");
            slideshowActive.data("slideshow").slidePrev();
            if (slideshowActive.data("slideshow").activeIndex === 1) {
                $(this).hide();
            } else {
                $(this).show();
            }
            $(this).siblings(".slide-next").show();
        };
        var fadeInProducts = function() {
            //retrieve title of the category clicked
            var cat = $(this).closest(".cat"), title = cat.find(".follow-wrap > .details-collection-subtitle");
            //tells the h2 that it has to be sticky
            title.addClass("open");
            //hide first line of product
            cat.children(".row").addClass("marginAddClick").fadeOut("fast");
            //show all products
            cat.find(".hidden").fadeIn(2e3);
            //hide button
            $(this).fadeOut(2e3);
            window.setTimeout(function() {
                if (DEVICE_TYPE === "desktop") {
                    api.scrollToY(cat.position().top, true);
                } else if (DEVICE_TYPE === "tablet") {
                    api.doScrollTop(api.getScrollTop() + cat.position().top, 100);
                }
            }, 300);
        };
        var fadeOutProducts = function() {
            var cat = $(this).closest(".cat"), hash = cat.attr("id"), positionDiv = $("#" + hash).position().top - 80, title = cat.find(".follow-wrap > .details-collection-subtitle");
            //hide products
            cat.find(".hidden").fadeOut(500);
            //show first line
            cat.children(".row").removeClass("marginAdd").fadeIn(500);
            //prevent button to display on scroll
            title.removeClass("open");
            $(this).fadeOut(500);
            cat.find(".more-button span").fadeIn(500);
            title.css({
                position: "static",
                top: "0"
            });
            // hash = hash.replace(/\s+/g, '-').toLowerCase();;
            // hash = hash.replace(new RegExp("\\s", 'g'),"");
            // hash = hash.replace(new RegExp("[àáâãäå]", 'g'),"a");
            // hash = hash.replace(new RegExp("æ", 'g'),"ae");
            // hash = hash.replace(new RegExp("ç", 'g'),"c");
            // hash = hash.replace(new RegExp("[èéêë]", 'g'),"e");
            // hash = hash.replace(new RegExp("[ìíîï]", 'g'),"i");
            // hash = hash.replace(new RegExp("ñ", 'g'),"n");
            // hash = hash.replace(new RegExp("[òóôõö]", 'g'),"o");
            // hash = hash.replace(new RegExp("œ", 'g'),"oe");
            // hash = hash.replace(new RegExp("[ùúûü]", 'g'),"u");
            // hash = hash.replace(new RegExp("[ýÿ]", 'g'),"y");
            if (hash) {
                if (DEVICE_TYPE === "desktop") {
                    api.scrollTo(hash, positionDiv, true);
                } else if (DEVICE_TYPE === "tablet") {
                    api.doScrollTop(positionDiv + api.getScrollTop());
                }
            }
        };
        var readMore = function(element, links, charNumber) {
            $(element).each(function() {
                var content = $(this).find(".big-description").html(), regex = /<br>/gi, result, indices = [], small, big, ellipsesText = "...";
                content = content.replace(/^\s+|\s+$/gm, "");
                content = content.replace(/[\n]*/gm, "");
                content = content.replace(/(<br>)*$/m, "");
                while (result = regex.exec(content)) {
                    indices.push(result.index);
                }
                if (indices.length >= 2) {
                    if (content.substr(indices[0], 8) === "<br><br>") {
                        small = content.substring(0, indices[0]);
                        big = content.substring(indices[0] + 4, content.length);
                    } else {
                        small = content.substring(0, indices[1]);
                        big = content.substring(indices[1] + 4, content.length);
                    }
                    $(this).find(".small-description").html(small + '<span class="more_ellipses">' + ellipsesText + "</span>");
                    $(this).find(".big-description").html(big);
                    $(this).find(links).show();
                } else {
                    $(this).find(".small-description").html(content);
                }
                // btn display
                $(this).show();
            });
        };
        var readMoreClick = function(e) {
            $(this).find("span").toggle();
            if ($(this).is(":visible")) $(this).css("display", "inline");
            $(this).prev().find(".more_ellipses").toggle();
            $(this).prev().find(".big-description").animate({
                height: "toggle",
                opacity: "toggle"
            }, 400);
        };
        var setCookie = function(key, value, expdays, path, domain, secure) {
            var d = new Date();
            d.setTime(d.getTime() + expdays * 24 * 60 * 60 * 1e3);
            var expires = d.toUTCString();
            document.cookie = key + "=" + value + (expdays ? ";expires=" + expires : "") + (path ? ";path=" + path : "") + (domain ? ";domain=" + domain : "") + (secure ? ";secure" : "");
        };
        var getCookie = function(key) {
            var name = key + "=", cookArr = document.cookie.split(";"), cookArrLength = cookArr.length;
            for (var i = 0; i < cookArrLength; i++) {
                var cookArrElt = cookArr[i];
                while (cookArrElt.charAt(0) === " ") {
                    cookArrElt = cookArrElt.substring(1);
                }
                if (cookArrElt.indexOf(key) === 0) {
                    return cookArrElt.substring(key.length + 1, cookArrElt.length);
                }
            }
            return "";
        };
        var hidePriceInit = function(btns, wrapper) {
            var cookieVal = getCookie("prices_display");
            wrapper.each(function() {
                var btnpath = $(this).find(btns);
                btnpath.show();
            });
        };
        var hidePrice = function() {
            var cookieVal = getCookie("prices_display");
            if (cookieVal !== "") {
                $("html").addClass("show-price");
                // hide more infos (price) when no price
                setCookie("prices_display", "", 365, "/");
            } else {
                $("html").removeClass("show-price");
                setCookie("prices_display", "none", 365, "/");
            }
        };
        var resizeImg = function(img, callback) {
            $(img).css("width", "auto").css("height", "auto");
            // Remove existing CSS
            $(img).removeAttr("width").removeAttr("height");
            // Remove HTML attributes   
            var origSizeW = $(img).width();
            var origSizeH = $(img).height();
            var ratioVt = origSizeW / origSizeH;
            var ratioHz = origSizeH / origSizeW;
            var winW = $(window).width();
            var winH = $(window).height();
            var screenSizeW = Math.round(winW);
            var screenSizeH = Math.round(winH);
            if (origSizeW >= origSizeH) {
                var newHeight = Math.round(screenSizeW * ratioHz);
                if (newHeight <= screenSizeH) {
                    $(img).css("width", screenSizeW);
                    // Set new width
                    $(img).css("height", newHeight);
                } else {
                    $(img).css("height", screenSizeH);
                }
            } else {
                $(img).css("height", screenSizeH);
            }
        };
        var displayPrdInfos = function(e) {
            $(this).find(".prd-infos").addClass("prd-display").addClass("prd-display2");
        };
        var noDisplayPrdInfos = function(e) {
            e.stopPropagation();
            $(this).closest(".prd-display").removeClass("prd-display");
        };
        var historyBack = function(e) {
            e.preventDefault();
            window.history.back();
        };
        var keypressNav = function(event) {
            if (event.which == 37 || event.which == 39) {
                var posY = api.getContentPositionY(), navPrdBlockPos = $("#prd_details_main").height(), navSliderPos = $("#more_product").offset().top, $nextBtn = $("#more_product .slide-next:visible")[0], $prevBtn = $("#more_product .slide-prev:visible")[0];
                if (posY > navSliderPos) {
                    if (event.which == 37) {
                        if ($prevBtn) {
                            $prevBtn.click();
                        }
                    } else if (event.which == 39) {
                        if ($nextBtn) {
                            $nextBtn.click();
                        }
                    }
                } else {
                    if (event.which == 37) {
                        $("#prd_details_main .ico_nav_l_arrow")[0].click();
                    } else if (event.which == 39) {
                        $("#prd_details_main .ico_nav_r_arrow")[0].click();
                    }
                }
            }
        };
        var requestAjaxPrice = function() {
            var cookieVal = getCookie("prices_display");
            $(".datas-price").each(function() {
                var $container = $(this);
                var collection_id = $container.data("collection");
                var category_id = $container.data("category");
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    data: {
                        collection_id: collection_id,
                        category_id: "",
                        indexed: true
                    },
                    url: pricing_url + sitelocEncoded + "/collection_products_detail",
                    success: function(result) {
                        collectionDisplayPrices($container, result);
                    },
                    complete: function(result) {}
                });
            });
        };
        var collectionDisplayPrices = function($container, result) {
            $container.find(".block-price").each(function() {
                var $this = $(this);
                var product_ref = $this.data("ref");
                var price = "";
                var request_price = $(".datas-request-price").data("request-price");
                var $prd_details_r = $this.parent().parent();
                var hasGrouped = $this.hasClass("block-price-grouped");
                var hasGroupedWithPrice = false;
                if (hasGrouped) {
                    var parent_ref = $this.siblings(".block-price-main").data("ref");
                    $(result[parent_ref]["grouped_product"]["product"]).each(function() {
                        var child = $(this);
                        if (child[0]["ref"] == product_ref) {
                            price = child[0]["price"];
                        }
                        hasGroupedWithPrice = hasGroupedWithPrice || price.indexOf("-1") === -1;
                    });
                } else {
                    if (result[product_ref] != undefined) {
                        price = result[product_ref].price;
                    }
                }
                // display price
                if (price != undefined && price != "") {
                    var check_price = price.split("-1");
                    if (check_price.length > 1) {
                        price = request_price;
                    }
                    $this.find(".val-price").html(price);
                    var cookieVal = getCookie("prices_display");
                    // hide price
                    if (cookieVal != "") {
                        $("html").removeClass("show-price");
                    } else {
                        $("html").addClass("show-price");
                        $prd_details_r.find(".prd_mentions").addClass("show-info-price");
                    }
                } else {
                    $this.find(".price").removeClass("show-info-price").addClass("no-price");
                    $(".toggle_btns").addClass("no-price");
                    $prd_details_r.find(".hide_price, .show_price, .prd_mentions").removeClass("show-info-price");
                }
                // Show / hide price more infos
                var $moreInfo;
                if ($(".prd_details").length) {
                    $moreInfo = $(".prd_mentions");
                } else {
                    $moreInfo = $this.closest(".prd-infos").find(".more-infos");
                }
                if (hasGrouped) {
                    hasGroupedWithPrice = hasGroupedWithPrice && !(check_price.length > 1);
                    // if the product or a group product have a price,
                    // then display the 'more info' text
                    if (hasGroupedWithPrice) {
                        $moreInfo.removeClass("no-info-price");
                    } else {
                        $moreInfo.addClass("no-info-price");
                    }
                } else {
                    if (!check_price || check_price.length > 1) {
                        $moreInfo.addClass("no-info-price");
                    } else {
                        $moreInfo.removeClass("no-info-price");
                    }
                }
            });
        };
        var scrollToProducts = function() {
            if (DEVICE_TYPE === "desktop") {
                api.scrollTo("", $(".list").position().top, true);
            } else if (DEVICE_TYPE === "tablet") {
                api.doScrollTop(api.getScrollTop() + $(".list").position().top);
            }
        };
        var tmConfirm;
        var selectProduct = function() {
            var top = $(".ico_list").position().top, left = $(".ico_list").position().left;
            if ($addEcrinClick.hasClass("selected")) {
                $popinAddEcrin.find("p").html($popinAddEcrin.data("add"));
            } else {
                $popinAddEcrin.find("p").html($popinAddEcrin.data("remove"));
            }
            $popinAddEcrin.css({
                display: "block",
                top: top - 40,
                left: left - 13
            });
            clearTimeout(tmConfirm);
            tmConfirm = setTimeout(function() {
                $popinAddEcrin.fadeOut("slow");
            }, 3e3);
        };
        setTimeout(function() {
            $(".details_collection .product, .more-button, .collection_push").css("visibility", "visible").hide().fadeIn("slow");
        }, 1);
        $(".necklaces.row2").prepend("<span class='hr'></span>");
        // SET EVENTS
        $window.unbind("resize", onResize).bind("resize", onResize);
        $window.resize(function() {
            resizeImg(".visionneuse img");
        });
        $visionneuseBtn.unbind("click", openVisionneuse).bind("click", openVisionneuse);
        $closeVisionneuseBtn.unbind("click", closeVisionneuse).bind("click", closeVisionneuse);
        if ($("#slideshow-prd").length > 0) {
            slideshowPrdInit();
        }
        $window.unbind("scroll", changeStickyNav).bind("scroll", changeStickyNav);
        $window.unbind("scroll", changeAnchorSticky).bind("scroll", changeAnchorSticky);
        $linkStickynav.unbind("click", clickStickyNav).bind("click", clickStickyNav);
        $anchorLink.unbind("click", clickStickyNav).bind("click", clickStickyNav);
        $moreButton.unbind("click", fadeInProducts).bind("click", fadeInProducts);
        $lessButton.unbind("click", fadeOutProducts).bind("click", fadeOutProducts);
        $filmClick.unbind("click", viewFilmClick).bind("click", viewFilmClick);
        if ($toggleCookie.length > 0) hidePriceInit($toggleBtns, $toggleCookie);
        if ($(readMoreSelector).length > 0) readMore(readMoreSelector, readMoreBtns, 150);
        $(readMoreBtns).unbind("click", readMoreClick).bind("click", readMoreClick);
        $toggleBtns.unbind("click", hidePrice).bind("click", hidePrice);
        $changeSlideshow.unbind("click", changeProductSlideshow).bind("click", changeProductSlideshow);
        $slideNext.unbind("click", slideNext).bind("click", slideNext);
        $slidePrev.unbind("click", slidePrev).bind("click", slidePrev);
        $addEcrinClick.unbind("click", addEcrinClick).bind("click", addEcrinClick);
        $shareClick.unbind("click", shareClick).bind("click", shareClick);
        $desc.unbind("click", scrollToProducts).bind("click", scrollToProducts);
        $starSelectProduct.unbind("click", selectProduct).bind("click", selectProduct);
        $prdInfos.unbind("click", displayPrdInfos).bind("click", displayPrdInfos);
        $closeprdInfos.unbind("click", noDisplayPrdInfos).bind("click", noDisplayPrdInfos);
        //$backBtn.unbind("click", historyBack).bind("click", historyBack);
        if ($(".prd_details").length > 0) {
            if ($("html").hasClass("ie7") || $("html").hasClass("ie8") || $("html").hasClass("ie9")) {
                $(document).unbind("keydown", keypressNav).bind("keydown", keypressNav);
            } else {
                $window.unbind("keydown", keypressNav).bind("keydown", keypressNav);
            }
        }
        $window.trigger("resize");
        initCheckEcrin();
        requestAjaxPrice();
        var webtrends = function() {
            // get tagplan
            var skeleton = $(".datas-wt").data("wt");
            var datas = new Array();
            datas = new Array();
            datas["wt_collection"] = $(".datas-wt-col").data("wt-col");
            datas["wt_category"] = $(".datas-wt-cat").data("wt-cat");
            datas["wt_ref"] = $(".datas-ref").data("ref");
            datas["wt_description"] = $.parseJSON($(".datas-wt-description").data("wt-description"));
            // view event
            var tagplan = {};
            $.each(skeleton.view, function(index, value) {
                tagplan[index] = clean_webtrends_tag(value, datas);
            });
            $.each(skeleton.common, function(index, value) {
                tagplan[index] = value;
            });
            send_webtrends(tagplan);
            // click event
            $(".wt-click").on("click", function() {
                var $this = $(this);
                var tagplan = {};
                datas = new Array();
                datas["wt_event"] = "click";
                datas["wt_label"] = $this.data("wt-value");
                datas["wt_collection"] = $this.parents(".datas-wt-col").data("wt-col");
                datas["wt_category"] = $this.parents(".datas-wt-cat").data("wt-cat");
                datas["wt_ref"] = $this.parents(".datas-ref").data("ref");
                datas["wt_description"] = $.parseJSON($this.parents(".datas-wt-description").data("wt-description"));
                $.each(skeleton.event, function(index, value) {
                    tagplan[index] = clean_webtrends_tag(value, datas);
                });
                $.each(skeleton.common, function(index, value) {
                    tagplan[index] = value;
                });
                // Specific case
                if ($this.hasClass("wt-specific")) {
                    var new_skeleton = $this.data("wt-specific");
                    $.each(new_skeleton, function(index, value) {
                        tagplan[index] = clean_webtrends_tag(value, datas);
                    });
                }
                // exceptions
                if ($this.hasClass("wt-add-box")) {
                    tagplan["WT.tx_e"] = "a";
                    tagplan["WT.tx_u"] = 1;
                }
                tagplan["WT.dl"] = 50;
                send_webtrends(tagplan);
                // set delay before redirect page
                if ($this.attr("href") && $this.attr("href").indexOf("#") == -1 && $this.attr("target") != "_blank") {
                    setTimeout(function() {
                        location.href = $this.attr("href");
                    }, 500);
                    return false;
                }
            });
        };
        var clean_webtrends_tag = function(value, datas) {
            value = value.replace("{%label%}", datas["wt_label"]);
            value = value.replace("{%event%}", datas["wt_event"]);
            value = value.replace("{%ref%}", datas["wt_ref"]);
            value = value.replace("{%collection%}", datas["wt_collection"]);
            value = value.replace("{%subcollection%}", datas["wt_category"]);
            value = value.replace("{%category%}", datas["wt_category"]);
            value = value.replace("{%description%}", datas["wt_description"]);
            return value;
        };
        var send_webtrends = function(tagplan) {
            if (dcs) {
                dcs.WT.dl = tagplan["WT.dl"];
                dcs.DCSext.ch_div = tagplan["DCSext.ch_div"];
                dcs.WT.cg_n = tagplan["WT.cg_n"];
                dcs.DCSext.ch_re = tagplan["DCSext.ch_re"];
                dcs.DCSext.ch_lang = tagplan["DCSext.ch_lang"];
                dcs.DCSext.ch_cat = tagplan["DCSext.ch_cat"];
                dcs.WT.cg_s = tagplan["WT.cg_s"];
                dcs.DCSext.ch_scat1 = tagplan["DCSext.ch_scat1"];
                dcs.DCSext.ch_scat2 = tagplan["DCSext.ch_scat2"];
                dcs.WT.pn_sku = tagplan["WT.pn_sku"];
                dcs.WT.pn_sku_de = tagplan["WT.pn_sku_de"];
                dcs.DCSext.ch_prod = tagplan["DCSext.ch_prod"];
                dcs.WT.pi = tagplan["WT.pi"];
                dcs.WT.tx_e = tagplan["WT.tx_e"];
                dcs.WT.tx_u = tagplan["WT.tx_u"];
                dcs.DCSext.feature = tagplan["DCSext.feature"];
                dcs.WT.nv = tagplan["WT.nv"];
                dcs.DCSext.nv_action = tagplan["DCSext.nv_action"];
                dcs.WT.clip_n = tagplan["WT.clip_n"];
                dcs.WT.clip_ev = tagplan["WT.clip_ev"];
                dcs.WT.clip_perc = tagplan["WT.clip_perc"];
                dcs.WT.z_collection = tagplan["WT.z_collection"];
                dcs.WT.z_sous_collection = tagplan["WT.z_sous_collection"];
                dcs.WT.z_categorie = tagplan["WT.z_categorie"];
                dcs.track();
            }
        };
        $(document).bind("ready", webtrends);
    };
    _m_ = _super.collection;
})(WFJ.module, jQuery);

(function(_super, $) {
    var _m_;
    var _scrollAllowed = true;
    // TAGS WEBTRENDS
    var tags_webtrends = {
        0: [ "W Service Clients", "W Service_clients_homepage_view", "0" ],
        1: [ "W Service Clients", "W Service_Clients_ChanelLogo_Click", "50" ],
        2: [ "W Service Clients", "W Service_Clients_ConseilsEntretien_Home_Click", "50" ],
        3: [ "W Service Clients", "W Service_Clients_NosServices_Home_Click", "50" ],
        4: [ "W Service Clients", "W Service_Clients_Deposer_Montre_Home_Click", "50" ],
        5: [ "W Service Clients", "W Service_Clients_Garanties_Authenticite_Home_Click", "50" ],
        6: [ "W Service Clients", "W Service_Clients_Modes_Emploi_Home_Click", "50" ],
        7: [ "W Service Clients", "W Service Clients BackButton_Click", "50" ],
        8: [ "W Service Clients", "W Service_Clients_Entretien_Menu_Click", "50" ],
        9: [ "W Service Clients", "W Service_Clients_Services_Menu_Click", "50" ],
        10: [ "W Service Clients", "W Service_Clients_Ou_Deposer_Menu_Click", "50" ],
        11: [ "W Service Clients", "W Service_Clients_Garanties_Authenticite_Menu_Click", "50" ],
        12: [ "W Service Clients", "W Service_Clients_Modes_Emploi_Menu_Click", "50" ],
        13: [ "W Service Clients", "W Service_Clients_Go_To_Store_Locator_Click", "50" ],
        14: [ "W Service Clients Entretien", "W Service_clients_Entretien_view", "0" ],
        15: [ "W Service Clients Entretien", "W Service_Clients Entretien_Montre_Automatique_Click", "50" ],
        16: [ "W Service Clients Entretien", "W Service_Clients Entretien_Montre_Quartz_Click", "50" ],
        17: [ "W Service Clients Entretien", "W Service_Clients Entretien_Nettoyage_Montre_Click", "50" ],
        18: [ "W Service Clients Entretien", "W Service_Clients Entretien_Etancheite_Montre_Click", "50" ],
        19: [ "W Service Clients Entretien", "W Service_Clients Entretien_Champs_magnetiques_Click", "50" ],
        20: [ "W Service Clients Entretien", "W Service_Clients Entretien_Frequence_entretien_Click", "50" ],
        21: [ "W Service Clients Entretien", "W Service_Clients Entretien_Diagnostic_Click", "50" ],
        22: [ "W Service Clients Services", "W Service_clients_NosServices_view", "0" ],
        23: [ "W Service Clients Services", "W Service_Clients_Services_Remplacement_Pile_Click", "50" ],
        24: [ "W Service Clients Services", "W Service_Clients_Services_Maintenance_Click", "50" ],
        25: [ "W Service Clients Services", "W Service_Clients_Services_Revision_complete_Click", "50" ],
        26: [ "W Service Clients Services", "W Service_Clients_Services_Polissage_Pile_Click", "50" ],
        27: [ "W Service Clients Services", "W Service_Clients_Services_Remplacement_Lanieres_Click", "50" ],
        28: [ "W Service Clients Services", "W Service_Clients_Services_Intervention_Bracelet_Click", "50" ],
        29: [ "W Service Clients Ou Deposer", "W Service_clients_Ou_Deposer_view", "0" ],
        30: [ "W Service Clients Garanties", "W Service_clients_Garanties_Authenticité_view", "0" ],
        31: [ "W Service Clients Garanties", "W Service_Clients_Garanties_Vente_Pile_Click", "50" ],
        32: [ "W Service Clients Garanties", "W Service_Clients_Garanties_Reparation_Click", "50" ],
        33: [ "W Service Clients Garanties", "W Service_Clients_Garanties_Authenticité_text_Click", "50" ],
        34: [ "W Service Clients Garanties", "W Service_Clients_Garanties_Montes_Volees_Click", "50" ],
        35: [ "W Service Clients Modes Emploi", "W Service_clients_Modes_Emploi_view", "0" ],
        36: [ "W Service Clients Modes Emploi", "W Service_clients_Modes_Emploi_J12_view", "0" ],
        37: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_J12_quartz_Click", "50" ],
        38: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_J12_auto_Click", "50" ],
        39: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_J12_chrono_auto_Click", "50" ],
        40: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_J12_Chrono_Super_Leggera_Click", "50" ],
        41: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_J12_GMT_Click", "50" ],
        42: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_J12_Marine_Click", "50" ],
        43: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_J12_Moonphase_Click", "50" ],
        44: [ "W Service Clients Modes Emploi", "W Service_clients_Modes_Emploi_Premiere_view", "0" ],
        45: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Premiere_Click", "50" ],
        46: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Select_J12_Click", "50" ],
        47: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Select_Premiere_Click", "50" ],
        48: [ "W Service Clients", "W Service_clients_Service_Clients_Joaillerie_Click", "50" ],
        49: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Grandes_complications_Premiere_Tourbillon volant_click", "50" ],
        50: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Grandes_complications_J12_RMT_click", "50" ],
        51: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Haute horlogerie_J12_Calibre_3125_click", "50" ],
        52: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_J12_chrono_superleggera_Click", "50" ],
        53: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_J12_calibre_3125_Click", "50" ],
        54: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_J12_RMT_Click", "50" ],
        55: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Premiere_Tourbillon_volant_Click", "50" ],
        56: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Mademoiselle_Prive_click", "50" ],
        57: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Montres_Joaillerie_click", "50" ],
        58: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Matelassee_click", "50" ],
        59: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_La_Ronde_click", "50" ],
        60: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Chocolat_click", "50" ],
        61: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Mademoiselle_click", "50" ],
        62: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_1932_click", "50" ],
        63: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Camelia_click", "50" ],
        64: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Grandes_complications_view", "0" ],
        65: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Haute_horlogerie_view", "0" ],
        66: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Mademoiselle_Prive_view", "0" ],
        67: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Montres_Joaillerie_view", "0" ],
        68: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Collections_Historiques_view", "0" ],
        69: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_J12_g10_Click", "50" ],
        70: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_J12_Tourbillon_Click", "50" ],
        71: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_J12_Tourbillon_Volant_Click", "50" ],
        72: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Grandes_complications_Tourbillon_Click", "50" ],
        73: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Grandes_complications_Tourbillon_Volant_Click", "50" ],
        74: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Boy_Friend_view", "0" ],
        75: [ "W Service Clients Modes Emploi", "W Service_Clients_Modes_Emploi_Boy_Friend_click", "50" ],
        100: [ "FJ Service Clients", "FJ Service Clients_homepage_view", "0" ],
        101: [ "FJ Service Clients", "FJ Service Clients_Chanel Logo_Click", "50" ],
        102: [ "FJ Service Clients_Home", "FJ Service Clients_Conseils Entretien_Click", "50" ],
        103: [ "FJ Service Clients_Home", "FJ Service Clients_Nos Services_Click", "50" ],
        104: [ "FJ Service Clients_Home", "FJ Service Clients_Deposer Bijou_Click", "50" ],
        105: [ "FJ Service Clients_Home", "FJ Service Clients_Garanties Authenticite_Click", "50" ],
        106: [ "FJ Service Clients", "FJ Service Clients BackButton_Click", "50" ],
        107: [ "FJ Service Clients_Menu", "FJ Service Clients_Entretien_Menu_Click", "50" ],
        108: [ "FJ Service Clients_Menu", "FJ Service Clients_Services_Menu_Click", "50" ],
        109: [ "FJ Service Clients_Menu", "FJ Service Clients_Ou_Deposer_Menu_Click", "50" ],
        110: [ "FJ Service Clients_Menu", "FJ Service Clients_Garanties_Authenticite_Menu_Click", "50" ],
        111: [ "FJ Service Clients_Store Locator", "FJ Service Clients_StoreLocator_Click", "50" ],
        112: [ "FJ Service Clients_Entretien", "FJ Service Clients_Entretien_view", "0" ],
        113: [ "FJ Service Clients_Entretien", "FJ Service Clients_Entretien_PorterVotreBijou_Click", "50" ],
        114: [ "FJ Service Clients_Entretien", "FJ Service Clients_Entretien_RangerVotreBijou_Click", "50" ],
        115: [ "FJ Service Clients_Entretien", "FJ Service Clients_Entretien_ContrôlerVotreBijou_Click", "50" ],
        116: [ "FJ Service Clients_Entretien", "FJ Service Clients_Entretien_PrendreSoindeVotreBijou_Click", "50" ],
        117: [ "FJ Service Clients_Entretien", "FJ Service Clients_Entretien_Glossaire_MetauxPrecieux_Click", "50" ],
        118: [ "FJ Service Clients_Entretien", "FJ Service Clients_Entretien_Glossaire_Ceramique_Click", "50" ],
        119: [ "FJ Service Clients_Entretien", "FJ  Service Clients_Entretien_Glossaire_PierresPrecieuses_Click", "50" ],
        120: [ "FJ Service Clients_Entretien", "FJ Service Clients_Entretien_Glossaire_PierresFines_Click", "50" ],
        121: [ "FJ Service Clients_Entretien", "FJ Service Clients_Entretien_Glossaire_Perles_Click", "50" ],
        122: [ "FJ Service Clients_Services", "FJ Service Clients_Services_View", "0" ],
        123: [ "FJ Service Clients_Services", "FJ Service Clients_Services_Polissage_Click", "50" ],
        124: [ "FJ Service Clients_Services", "FJ Service Clients_Services_RemplacementPierre_Click", "50" ],
        125: [ "FJ Service Clients_Services", "FJ Service Clients_Services_RemplacementFermoir_Click", "50" ],
        126: [ "FJ Service Clients_Services", "FJ Service Clients_Services_RenfilagePerles_Click", "50" ],
        127: [ "FJ Service Clients_Services", "FJ Service Clients_Services_MiseTaille_Click", "50" ],
        128: [ "FJ Service Clients_Services", "FJ Service Clients_Services_Gravure_Click", "50" ],
        129: [ "FJ Service Clients_Services", "FJ Service Clients_Services_DétailOpérations_Click", "50" ],
        130: [ "FJ Service Clients_DeposerBijou", "FJ Service Clients_OuDeposerBijou_View", "0" ],
        131: [ "FJ Service Clients_Garanties", "FJ Service Clients_Garanties_View", "0" ],
        132: [ "FJ Service Clients_ServiceClientsHorlo", "FJ Service Clients_ServiceClientsHorlo_Click", "50" ],
        133: [ "FJ Service Clients_Entretien", "FJ Service Clients_Entretien_PorterVotreBijou_view", "0" ],
        134: [ "FJ Service Clients_Entretien", "FJ Service Clients_Entretien_RangerVotreBijou_view", "0" ],
        135: [ "FJ Service Clients_Entretien", "FJ Service Clients_Entretien_ControlervotreBijou_view", "0" ],
        136: [ "FJ Service Clients_Glossaire", "FJ Service Clients_Entretien_PrendreSoinBijou_MetauxPrecieux_view", "0" ],
        137: [ "FJ Service Clients_Glossaire", "FJ Service Clients_Entretien_PrendreSoinBijou_Ceramique_view", "0" ],
        138: [ "FJ Service Clients_Glossaire", "FJ Service Clients_Entretien_PrendreSoinBijou_PierresPrecieuses_view", "0" ],
        139: [ "FJ Service Clients_Glossaire", "FJ Service Clients_Entretien_PrendreSoinBijou_PierresFines_view", "0" ],
        140: [ "FJ Service Clients_Glossaire", "FJ Service Clients_Entretien_PrendreSoinBijou_Perles_view", "0" ],
        141: [ "FJ Service Clients_Services", "FJ Service Clients_Services_RemplacementPierre_View", "0" ],
        142: [ "FJ Service Clients_Services", "FJ Service Clients_Services_RemplacementFermoir_View", "0" ],
        143: [ "FJ Service Clients_Services", "FJ Service Clients_Services_RenfilagePerles_View", "0" ],
        144: [ "FJ Service Clients_Services", "FJ Service Clients_Services_MiseTaille_View", "0" ],
        145: [ "FJ Service Clients_Services", "FJ Service Clients_Services_Gravure_View", "0" ],
        146: [ "FJ Service Clients_Services", "FJ Service Clients_Services_DétailOpérations_View", "0" ],
        147: [ "FJ Service Clients_Services", "FJ Service Clients_Entretien_PrendreSoinBijou_view", "0" ]
    };
    _super.customer_services = function() {
        this.DEBUG = false;
        // INIT VARS
        var $boxQuestion = $(".question"), $customerServices = $("#customer-services"), $boxAnswer = $(".answer"), $wrapper = $(".wrapper"), $closeMenu = $(".close-ss-nav"), $mainNav = $("#main-nav"), $ssNav = $("#ss-nav"), idMenu = [], $absolute = $(".absolute"), areaHeight = null, resizeStopTimer = null, _this = this;
        //         $('.side-submenu-link').first('li a').addClass('active');
        //PLUGIN JSCROLLPANE
        if (!$customerServices.find(".mode-emploi #dispatch").length) {
            var api = $wrapper.jScrollPane({
                autoReinitialise: true,
                autoReinitialiseDelay: 20,
                mouseWheelSpeed: 100,
                animateScroll: false
            }).data("jsp");
        }
        if ($customerServices.find(".box").length) {
            $(window).on("resize", function() {
                clearTimeout(resizeStopTimer);
                resizeStopTimer = setTimeout(function() {
                    $(".box").each(function() {
                        var posTop = $(this).position().top;
                        idMenu[this.id] = {
                            start: posTop,
                            end: posTop + $(this).outerHeight()
                        };
                    });
                    areaHeight = $("#centerblock_wild").outerHeight();
                    $("html, body").trigger("scroll");
                }, 400);
            });
            $(window).trigger("resize");
            var timeOutScroll;
            $("html, body").on("scroll", function() {
                var values = null, posY = api.getContentPositionY();
                for (var id in idMenu) {
                    var posStart = idMenu[id]["start"] - posY, posEnd = idMenu[id]["end"] - posY;
                    if (posStart <= areaHeight / 3 && posEnd >= areaHeight / 3) {
                        values = id;
                        break;
                    }
                }
                if (!values) {
                    return;
                }
                clearTimeout(timeOutScroll);
                timeOutScroll = setTimeout(function() {
                    if (!$('.side-submenu-link[href="#' + values + '"]').hasClass("active")) {
                        var idView = $("#" + values).data("tag-direct-anchor");
                        if (idView >= 0) {
                            _this.send_stats({
                                id: idView
                            });
                        }
                    }
                    $(".side-submenu-link").removeClass("active");
                    $('.side-submenu-link[href="#' + values + '"]').addClass("active");
                    if (posY > $("#soin-bijou").position().top - 200) {
                        $('.side-submenu-link[href="#soin-bijou"]').addClass("active");
                        $(".deep-menu").fadeIn();
                    } else {
                        $('.side-submenu-link[href="#soin-bijou"]').removeClass("active");
                        $(".deep-menu").hide();
                    }
                }, 250);
            });
            $(".side-submenu-link").on("click", function(e) {
                e.preventDefault();
                if (!_scrollAllowed) {
                    return false;
                }
                _scrollAllowed = false;
                setTimeout(function() {
                    _scrollAllowed = true;
                }, 300);
                var hash = e.target.hash.split("#");
                var offsetGlobal = $("#globaldiv").offset().top;
                var offsetDiv = $("#" + hash[1]).offset().top;
                var positionDiv = $("#" + hash[1]).position().top;
                window.location.hash = hash[1];
                if (hash[1]) {
                    api.scrollTo(hash[1], positionDiv, true);
                }
                return false;
            });
        }
        // RUBRIQUE ENTRETIEN QUESTIONS
        $boxQuestion.on("click", function() {
            var _this = this;
            if ($(_this).hasClass("active")) {
                _this = null;
            }
            $boxQuestion.removeClass("active");
            $boxAnswer.slideUp();
            $(_this).addClass("active").find(".answer").slideDown();
        });
        $boxQuestion.removeClass("active");
        $boxAnswer.slideUp();
        // CLOSE MENU
        $ssNav.addClass("active");
        $closeMenu.on("click", function() {
            $mainNav.addClass("active");
            //            $('#menuleftbottom').show();
            $ssNav.removeClass("active");
        });
        // HIDE CREDITS
        if (!$("body").find(".credits").length) {}
        //MODE D EMPLOIS
        if ($customerServices.find(".mode-emploi").length) {
            $absolute.hide().first().show();
            $("#main-nav li:last-child").on("click", function(e) {
                e.preventDefault();
                $absolute.hide().first().show();
                $mainNav.removeClass("active");
                $ssNav.addClass("active");
            });
            $(".side-submenu-link,#dispatch a").on("click", function(e) {
                var hash = $(this).closest("a")[0].hash.split("#");
                $absolute.hide();
                var api = $wrapper.jScrollPane({
                    autoReinitialise: true,
                    autoReinitialiseDelay: 20,
                    mouseWheelSpeed: 100,
                    animateScroll: false
                }).data("jsp");
                $absolute.filter("#" + hash[1]).fadeIn(1e3);
                $(".side-submenu-link").removeClass("active");
                $('.side-submenu-link[href="#' + hash[1] + '"]').addClass("active");
            });
        }
        // DEPOSER VOTRE MONTE
        if ($customerServices.find(".deposer").length) {
            $mainNav.addClass("active");
        }
        this.set_track_events();
    };
    _m_ = _super.customer_services;
    /**
     * SET TRACK EVENTS
     * @returns _super.customer_services
     */
    _m_.prototype.set_track_events = function set_track_events() {
        var _this = this;
        var $btnTrack = $("#customer-services").find("[data-tag-id]");
        var $trackView = $("#customer-services").find("[data-tag-direct]");
        var trackEvents = function trackEvents(e) {
            var $this = $(this);
            //            var isDefaultPrevented = !!$this.data("prevent-default") && $this.data("prevent-default") !== "false";
            //            if (isDefaultPrevented) { // ADD DELAY TO NATIVE LINKS
            e.preventDefault();
            if (!$this.hasClass("store-locator-link")) {
                if ($this.attr("target") === "_blank") {
                    window.open($this.attr("href"));
                } else {
                    setTimeout(function() {
                        if ($this.attr("href").indexOf("#") == -1) {
                            location.href = $this.attr("href");
                        }
                    }, 1500);
                }
            }
            //            }
            e.stopPropagation();
            var id = "" + $(this).data("tag-id");
            $(id.split(",")).each(function(i, el) {
                if (el >= 0) _this.send_stats({
                    id: el
                });
            });
        };
        var trackEventsView = function trackEventsView(e) {
            //            var $this = $(this);
            var $tagDirect = $("[data-tag-direct]");
            var $tagDirectAnchor = $("[data-tag-direct-anchor]");
            var hash = window.location.hash;
            $tagDirect.each(function() {
                var idView = $(this).data("tag-direct");
                if (idView >= 0) _this.send_stats({
                    id: idView
                });
            });
        };
        $btnTrack.unbind("click", trackEvents).bind("click", trackEvents);
        trackEventsView();
        return _this;
    };
    /**
     *
     * @param {type} data
     * @returns {_L8.send_stats}
     */
    _m_.prototype.send_stats = function send_stats(data) {
        var _this = this;
        if (!data.id in tags_webtrends) return;
        var platform = "Desktop";
        // Mobile / Tablet
        if (_this.isMobile()) {
            platform = "Mobile";
        } else if (_this.isTablet()) {
            platform = "Tablet";
        }
        if ($("#globaldiv").hasClass("customer_services_jewelry")) {
            var ch_scat1 = "FJ Service Clients-<<Platform>>";
        } else {
            var ch_scat1 = "W Service Clients-<<Platform>>";
        }
        var ch_scat2 = encodeURI(tags_webtrends[data.id][0]);
        var ch_prod = encodeURI(tags_webtrends[data.id][1]);
        var dl = encodeURI(tags_webtrends[data.id][2]);
        ch_scat1 = ch_scat1.replace("<<Platform>>", platform);
        if (_this.DEBUG) {
            console.log("============================");
            console.log("DATA TRACK : " + data.id);
            console.log("----------------------------");
            console.log("ch_scat1 : " + ch_scat1);
            console.log("ch_scat2 : " + ch_scat2);
            console.log("ch_prod : " + ch_prod);
            console.log("dl : " + dl);
            console.log("============================");
        }
        stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, ch_scat2, ch_prod, dl);
        return _this;
    };
    _m_.prototype.isTablet = function isTablet() {
        return /ipad|android 3|sch-i800|playbook|tablet|kindle|gt-p1000|sgh-t849|shw-m180s|a510|a511|a100|dell streak|silk/i.test(navigator.userAgent.toLowerCase());
    };
    _m_.prototype.isMobile = function isMobile() {
        return /iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(navigator.userAgent.toLowerCase());
    };
})(WFJ.module, jQuery);

/*
 * diamant
 */
(function(_super, $) {
    var _m_;
    _super.diamant = function() {
        // INIT VARS 
        var _this = this;
        var $articles = $("li.article");
        var $listArticles = $("#liste_articles");
        var $filters = $("#diamants_filtre li");
        var $scrollBar;
        var changeSlideFunction = function(e, element, ui) {
            if ($("#diamants_filtre").find("a[rel=" + ui.value + "]").length) {
                $("#diamants_filtre").find("li").removeClass("active");
                $("#diamants_filtre").find("a[rel=" + ui.value + "]").parent().addClass("active");
            }
        };
        // SET DEFAULT VALUES
        $articles.each(function(index, elmt) {
            elmt.style.left = index * (elmt.offsetWidth + 120) + "px";
        });
        $listArticles.css("left", "0px");
        // SET SCROLLBAR
        $listArticles.unbind("chanelScroller:changeSlide chanelScroller:createSlider", changeSlideFunction).bind("chanelScroller:changeSlide chanelScroller:createSlider", changeSlideFunction);
        $scrollBar = $(".scroll-wrapper .scroll").chanelScroller({
            scrollContent: "#liste_articles",
            margeLeft: 0
        });
        // FILTER CLICK CALLBACK
        var filterClick = function(e) {
            e.preventDefault();
            var value = $(this).find("a").attr("rel");
            $scrollBar.slider("value", value);
        };
        var swipeContent = function(e) {
            e.preventDefault();
            if (e.direction == "right") {
                $("#sliderControlLeft").trigger("click");
            } else if (e.direction == "left") {
                $("#sliderControlRight").trigger("click");
            }
        };
        // SET EVENTS		
        $filters.unbind("click", filterClick).bind("click", filterClick);
        if (isMobileTablet()) {
            $listArticles.unbind("swipe", swipeContent).bind("swipe", {
                swipe_time: 500
            }, swipeContent);
        }
        return _this;
    };
    _m_ = _super.diamant;
})(WFJ.module, jQuery);

/*
 * ecrin
 */
(function(_super, $) {
    var _m_;
    _super.ecrin = function() {
        // INIT VARS
        var _this = this;
        var $viewEcrin = $("a.viewEcrin");
        var $loader = $("#chargement");
        var $centerdiv = $("#centerdiv");
        var $delEcrin = $("#del_ecrin");
        var $popin = $("#popin");
        var $inline_popup = $("#inline_popup");
        var $delFromEcrin = $(".delFromEcrin");
        var $blocDescription = $("#bloc_description");
        var $listItemHorlo = $("#listItemHorlo");
        var $listItemJoail = $("#listItemJoail");
        var $partagerToutBtn = $("#partagerToutBtn");
        var $partageBtn = $("#partageBtn");
        var $showPrice = $("#showPrice");
        var $priceBloc = $("#price_bloc");
        var $printBtn = $("#printBtn");
        // SET DEFAULT VALUES
        $blocDescription.jScrollPane({
            autoReinitialise: true
        });
        $listItemHorlo.jScrollPane({
            autoReinitialise: true
        });
        $listItemJoail.jScrollPane({
            autoReinitialise: true
        });
        // SET CALLBACKS
        var viewEcrinClick = function(e) {
            e.preventDefault();
            var $subsection_url = $("#subsection_url").val();
            var elmt = this;
            var params = elmt.href.substring(elmt.href.indexOf("?") + 1, elmt.href.length);
            if (elmt.id.substring(0, 3) == "del") {
                stats(ch_re, ch_lang, cg_n, $("#cg_s").val(), ch_div, $("#ch_cat").val(), $("#ch_scat1").val(), "JBox remove item", "", 50);
            }
            $loader.show();
            $.ajax({
                type: "GET",
                url: "/" + sitelocEncoded + $subsection_url + "?" + params,
                data: {},
                success: function(result) {
                    $centerdiv.html(result);
                },
                complete: function(result) {
                    setTimeout(function() {
                        $("#ecrin_nbitem").show();
                    }, 500);
                    $loader.hide();
                    WFJ.getDataController(false);
                    WFJ.ecrin.updateLinkEcrin();
                }
            });
        };
        var delEcrinClick = function(e) {
            e.preventDefault();
            var subsection_url = $("#subsection_url").val();
            $.ajax({
                type: "GET",
                url: "/" + sitelocEncoded + subsection_url + "-delete/all",
                data: {},
                success: function(result) {
                    $popin.html(result).removeClass("partagerPopin").addClass("delEcrinPopin").show();
                    $inline_popup.show();
                },
                complete: function(result) {
                    $("#deleteEcrinBtn").bind("click", function(e) {
                        e.preventDefault();
                        WFJ.ecrin.deleteCookie();
                        WFJ.ecrin.updateLinkEcrin();
                        $(this).parent().addClass("active");
                        stats(ch_re, ch_lang, cg_n, $("#cg_s").val(), ch_div, $("#ch_cat").val(), $("#ch_scat1").val(), "Jbox remove all items", "", 50);
                        setTimeout(function() {
                            $inline_popup.hide();
                        }, 200);
                        $loader.show();
                        $.ajax({
                            type: "GET",
                            url: "/" + sitelocEncoded + $("#subsection_url").val() + "?empty=true",
                            data: {},
                            success: function(result) {
                                $centerdiv.html(result);
                                $loader.hide();
                            },
                            complete: function(result) {
                                WFJ.getDataController(false);
                            }
                        });
                    });
                    $("#closePopinBtn").bind("click", function(e) {
                        e.preventDefault();
                        $(this).parent().addClass("active");
                        setTimeout(function() {
                            $inline_popup.hide();
                            $(".mask").hide();
                        }, 200);
                    });
                }
            });
        };
        var delFromEcrinClick = function(e) {
            e.preventDefault();
            var isHorlo = !!$(this).closest("#listItemHorlo").length;
            var isJoail = !!$(this).closest("#listItemJoail").length;
            var type = null;
            var product = $(this).attr("id");
            if (isHorlo) {
                type = "watches";
                product = product.replace("del_horlo_", "");
            } else if (isJoail) {
                type = "jewelry";
                product = product.replace("del_joail_", "");
            }
            if (type != null && product != null) {
                WFJ.ecrin.deleteFromEcrin(product, type);
                WFJ.ecrin.updateLinkEcrin();
                location.href = $(".link-ecrin").attr("href");
            }
        };
        var partagerToutBtnClick = function(e) {
            e.preventDefault();
            stats(ch_re, ch_lang, cg_n, $("#cg_s").val(), ch_div, $("#ch_cat").val(), $("#ch_scat1").val(), "Jbox list share", "", 50);
            $loader.show();
            var productsList = "";
            $(".listItemBox li").each(function() {
                productsList += $(this).data("product-ref") + ",";
            });
            $.ajax({
                type: "GET",
                url: "/" + sitelocEncoded + "partager_all?level1=" + level1,
                data: {
                    products: productsList
                },
                success: function(result) {
                    $popin.html(result).removeClass().addClass("partagerPopin").show();
                    $inline_popup.show();
                    $loader.hide();
                    if (locale == "ja_JP") $popin.addClass(level1).show();
                },
                complete: function(result) {
                    $("#closePopinBtn").bind("click", function(e) {
                        e.preventDefault();
                        $inline_popup.hide();
                        $(".mask").hide();
                    });
                    WFJ.getDataController(false);
                }
            });
        };
        var partageBtnClick = function(e) {
            e.preventDefault();
            var data = {
                sectionJoa: "FJ ",
                sectionHorlo: "W "
            };
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, $("#ch_scat1").val(), data[section === "watches" ? "sectionHorlo" : "sectionJoa"] + " " + $("#product_ref").val() + "_Details", $("#ch_scat1").val() + " " + $("#product_ref").val() + "_Share_Click", 50, $("#product_ref").val(), "Share");
            $loader.show();
            var urlplus = "";
            if ($("#activeList").length) {
                urlplus = "&section=" + $("#activeList").val();
            }
            $.ajax({
                type: "GET",
                url: "/" + sitelocEncoded + "partager_product?level1=" + level1 + urlplus,
                data: {
                    id: $("#product_ref").val(),
                    collection: $("#collectionRef").val(),
                    category: $("#categoryRef").val()
                },
                success: function(result) {
                    $popin.html(result).removeClass().addClass("partagerPopin").show();
                    if (locale == "ja_JP") $popin.addClass(level1).show();
                    $inline_popup.show();
                    $loader.hide();
                },
                complete: function(result) {
                    $("#closePopinBtn").bind("click", function(e) {
                        e.preventDefault();
                        $inline_popup.hide();
                        $(".mask").hide();
                    });
                    $("#commentaire").bind("keypress", function(e) {
                        var maximum = 250;
                        // Nbre de caractères
                        var $champ = $("#commentaire");
                        var $indic = $("#indicateur");
                        if ($champ.val().length > maximum) $champ.val($champ.val().substring(0, maximum));
                        $indic.removeClass("indicateur-red");
                    });
                    WFJ.getDataController(false);
                    if (level1 == "C06" && locale == "ja_JP") $("#colDeco").append($("#imageLarge").html());
                }
            });
        };
        var showPriceClick = function(e) {
            e.preventDefault();
            var data = {
                sectionJoa: "FJ ",
                sectionHorlo: "W "
            };
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, $("#ch_scat1").val(), data[section === "watches" ? "sectionHorlo" : "sectionJoa"] + " " + $("#product_ref").val() + "_Details", $("#ch_scat1").val() + " " + $("#product_ref").val() + "_Price_Click", 50, $("#product_ref").val(), "Price");
            $showPrice.hide();
            $priceBloc.fadeIn(1e3);
            setTimeout(function() {
                $priceBloc.fadeIn(1e3, function() {
                    $priceBloc.show();
                });
            }, 4e4);
        };
        var printBtnClick = function(e) {
            var data = {
                sectionJoa: "FJ ",
                sectionHorlo: "W "
            };
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, $("#ch_scat1").val(), data[section === "watches" ? "sectionHorlo" : "sectionJoa"] + " " + $("#product_ref").val() + "_Details", $("#ch_scat1").val() + " " + $("#product_ref").val() + "_Print_Click", 50, $("#product_ref").val(), "Print");
        };
        // SET EVENTS
        $viewEcrin.unbind("click", viewEcrinClick).bind("click", viewEcrinClick);
        $delEcrin.unbind("click", delEcrinClick).bind("click", delEcrinClick);
        $delFromEcrin.unbind("click", delFromEcrinClick).bind("click", delFromEcrinClick);
        $partagerToutBtn.unbind("click", partagerToutBtnClick).bind("click", partagerToutBtnClick);
        $partageBtn.unbind("click", partageBtnClick).bind("click", partageBtnClick);
        $showPrice.unbind("click", showPriceClick).bind("click", showPriceClick);
        $printBtn.unbind("click", printBtnClick).bind("click", printBtnClick);
        return _this;
    };
    _m_ = _super.ecrin;
})(WFJ.module, jQuery);

/*
 * glossaire
 */
(function(_super, $) {
    var _m_;
    _super.glossaire = function() {
        // INIT VARS
        var _this = this;
        var $glossaire = $("#glossaire_ul");
        var $glossaireLi = $("#glossaire_ul li");
        var $glossaireList = $("#glossaire_list");
        var oldvalue = 0;
        var decalageGlossaire;
        // SET DEFAULTS VALUES
        $glossaire.css({
            position: "absolute",
            left: "0px"
        });
        $glossaireLi.removeClass().first().addClass("active");
        if (!isMobile()) {
            $(".noPBalise").jScrollPane({
                autoReinitialise: 1e3
            });
        }
        if (!isMobileTablet()) {
            $(".noPBalise").on("mousewheel", function(e) {
                e.stopImmediatePropagation();
            });
        }
        var glossaireScrollerSlide = function glossaireScrollerSlide(e, event, ui) {
            var value = ui.value;
            $glossaireLi.animate({
                opacity: "0.25"
            }, 250, function() {
                $(this).removeClass();
            });
            $($glossaireLi[value]).animate({
                opacity: "1"
            }, 250, function() {
                $(this).addClass("active");
            });
        };
        $glossaire.bind("chanelScroller:changeSlide", glossaireScrollerSlide);
        // SET SCROLLBAR
        $("#glossaire_scroll").find(".scroll-wrapper .scroll").chanelScroller({
            scrollContent: "#glossaire_ul",
            margeLeft: 0
        });
        var swipeContent = function swipeContent(e) {
            e.preventDefault();
            if (e.direction == "right") {
                $("#sliderControlLeft").trigger("click");
            } else if (e.direction == "left") {
                $("#sliderControlRight").trigger("click");
            }
        };
        if (isMobileTablet()) {
            $glossaireList.unbind("swipe", swipeContent).bind("swipe", {
                swipe_time: 500
            }, swipeContent);
        }
        var windowChangeVersion = function windowChangeVersion() {
            var containerWidth, itemWidth;
            if (WFJ.resVersion === "Small") {
                containerWidth = 766;
                itemWidth = 330;
            } else {
                containerWidth = 1022;
                itemWidth = 235;
            }
            decalageGlossaire = Math.round((containerWidth - itemWidth) / 2);
            $("#glossaire_ul").css({
                "margin-left": decalageGlossaire
            });
        };
        $("body").on("window:changeresize", windowChangeVersion).trigger("window:changeresize");
        return _this;
    };
    _m_ = _super.glossaire;
})(WFJ.module, jQuery);

/*
 * home watches
 */
(function(_super, $) {
    var _m_;
    _super.home_slideshow = function() {
        var _this = this;
        var timerChangeItem = 3e3;
        var timerDuration = 800;
        var timer;
        var $container = $("#centerblock");
        var $items = $container.find(".item");
        var $popin = $items.find(".legal-popin");
        var $puces = $container.find(".puce-nav");
        var $closePopin = $container.find(".close");
        var itemsLength = $items.length;
        for (var i = 0; i < itemsLength; i++) {
            $puces.append("<li><span></span></li>");
        }
        $closePopin.on("click", function() {
            $(this).parent().hide();
            var data = {
                sectionJoa: "FJ ",
                sectionHorlo: "W "
            };
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, data[section === "watches" ? "sectionHorlo" : "sectionJoa"] + "Main Homepage ", data[section === "watches" ? "sectionHorlo" : "sectionJoa"] + "Main Homepage LBPopin", data[section === "watches" ? "sectionHorlo" : "sectionJoa"] + "Main_Homepage_legalFJClose_click", "50", $("#product_ref").val());
        });
        $container.find(".item a").on("click", function() {
            $this = $(this);
            var data = {
                sectionJoa: "FJ ",
                sectionHorlo: "W "
            };
            var currentIndex = $this.parents(".item").index();
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, data[section === "watches" ? "sectionHorlo" : "sectionJoa"] + "Main Homepage ", data[section === "watches" ? "sectionHorlo" : "sectionJoa"] + "Main Homepage slider", data[section === "watches" ? "sectionHorlo" : "sectionJoa"] + "Main_Homepage_slider_" + currentIndex + "_click", "50", $("#product_ref").val(), "", "Homepage", "slider_" + currentIndex, "click");
        });
        var $pucesLi = $puces.find("li");
        // hide all items except first one
        $items.eq(0).show();
        $items.not(":eq(0)").hide();
        var doAnimation = function(index) {
            var nextIndex = index + 1;
            var nextIndexTag = index + 1;
            $pucesLi.eq(index).addClass("active");
            if (nextIndex === itemsLength) {
                nextIndex = 0;
            }
            var $nextItem = $items.eq(nextIndex);
            var hideItem = function() {
                $pucesLi.eq(index).removeClass("active");
                $items.eq(index).fadeOut(timerDuration, showNextItem);
            };
            var showNextItem = function() {
                $nextItem.fadeIn(timerDuration, function() {
                    doAnimation(nextIndex);
                });
            };
            var data = {
                sectionJoa: "FJ ",
                sectionHorlo: "W "
            };
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, data[section === "watches" ? "sectionHorlo" : "sectionJoa"] + "Main Homepage ", data[section === "watches" ? "sectionHorlo" : "sectionJoa"] + "Main Homepage slider", data[section === "watches" ? "sectionHorlo" : "sectionJoa"] + "Main_Homepage_slider_" + nextIndexTag + "_view", "50", $("#product_ref").val(), "", "Homepage", "slider_" + nextIndexTag, "view");
            clearTimeout(timer);
            timer = setTimeout(hideItem, timerChangeItem);
        };
        var clickOnPuce = function() {
            var indexLi = $(this).index();
            var nextIndex = indexLi + 1;
            $pucesLi.removeClass("active");
            $pucesLi.eq(indexLi).addClass("active");
            clearTimeout(timer);
            $items.hide();
            $items.eq(indexLi).fadeIn(timerDuration);
            doAnimation(indexLi);
        };
        setTimeout(function() {
            doAnimation(0);
        }, 1500);
        $pucesLi.on("click", clickOnPuce);
        return _this;
    };
    _m_ = _super.home_slideshow;
})(WFJ.module, jQuery);

/*
 * sample module
 */
(function(_super, $) {
    var _m_;
    _super.jardins_camelias = function() {
        var _this = this;
        /* Browser/OS detection */
        var iOS = navigator.userAgent.match(/(iPhone|iPod|iPad)/i);
        var BrowserDetect = {
            init: function() {
                this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
                this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
                this.OS = this.searchString(this.dataOS) || "an unknown OS";
            },
            searchString: function(data) {
                for (var i = 0; i < data.length; i++) {
                    var dataString = data[i].string;
                    var dataProp = data[i].prop;
                    this.versionSearchString = data[i].versionSearch || data[i].identity;
                    if (dataString) {
                        if (dataString.indexOf(data[i].subString) != -1) return data[i].identity;
                    } else if (dataProp) return data[i].identity;
                }
            },
            searchVersion: function(dataString) {
                var index = dataString.indexOf(this.versionSearchString);
                if (index == -1) return;
                return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
            },
            dataBrowser: [ {
                string: navigator.userAgent,
                subString: "Chrome",
                identity: "Chrome"
            }, {
                string: navigator.userAgent,
                subString: "OmniWeb",
                versionSearch: "OmniWeb/",
                identity: "OmniWeb"
            }, {
                string: navigator.vendor,
                subString: "Apple",
                identity: "Safari",
                versionSearch: "Version"
            }, {
                prop: window.opera,
                identity: "Opera",
                versionSearch: "Version"
            }, {
                string: navigator.vendor,
                subString: "iCab",
                identity: "iCab"
            }, {
                string: navigator.vendor,
                subString: "KDE",
                identity: "Konqueror"
            }, {
                string: navigator.userAgent,
                subString: "Firefox",
                identity: "Firefox"
            }, {
                string: navigator.vendor,
                subString: "Camino",
                identity: "Camino"
            }, {
                string: navigator.userAgent,
                subString: "Netscape",
                identity: "Netscape"
            }, {
                string: navigator.userAgent,
                subString: "MSIE",
                identity: "Explorer",
                versionSearch: "MSIE"
            }, {
                string: navigator.userAgent,
                subString: "Gecko",
                identity: "Mozilla",
                versionSearch: "rv"
            }, {
                string: navigator.userAgent,
                subString: "Mozilla",
                identity: "Netscape",
                versionSearch: "Mozilla"
            } ],
            dataOS: [ {
                string: navigator.platform,
                subString: "Win",
                identity: "Windows"
            }, {
                string: navigator.platform,
                subString: "Mac",
                identity: "Mac"
            }, {
                string: navigator.userAgent,
                subString: "iPhone",
                identity: "iPhone/iPod"
            }, {
                string: navigator.platform,
                subString: "Linux",
                identity: "Linux"
            } ]
        };
        BrowserDetect.init();
        function checkClient() {
            if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) {
                $("body").addClass("iPhone");
            }
        }
        checkClient();
        /*==========================================*/
        /*             INITIALIZATION               */
        /*==========================================*/
        var $camelia = $("#camelia");
        var $scene1 = $("#scene-1");
        var $scenes = $("#scenes");
        var $sceneVideo = $("#scene-video");
        var $scroller = $("#scroller");
        var nbScene = $(".scene").length;
        var $arrows = $(".prevnext");
        var positions = [ 0, 1, 2, 3, 4, 4.5 ];
        var positionsPx = Array();
        var hideLogoPositions = [ 0, 0, 0, 0, 0, 1 ];
        var currentPosition = 0;
        var supportsTouch = "ontouchstart" in window || navigator.msMaxTouchPoints;
        var has3d = has3d();
        var videoLink = $("#flashcontent").text();
        var currentScene = null;
        var myScroll = null;
        var videoCamelia = null;
        var vidUrl = $("#flashcontent").text();
        var platform = {
            isIpad: isTablet(),
            isIphone: isMobile(),
            isMobile: isMobileTablet(),
            isDesktop: !isMobileTablet(),
            isFlash: !!swfobject.getFlashPlayerVersion().major,
            isFFMac: isFirefoxMac()
        };
        var cameliaTimeout = {
            logoHide: null,
            mouseMove: null,
            areaReact: null
        };
        var allowEvent = true;
        // Set global variable for timers
        var magnetize = "";
        var changePos = "";
        // Set global variable for allowing gesture
        var haveGesture = true;
        // Stats player flash
        window.cameliaFlashStats = true;
        setTimeout(function() {
            try {
                window.scrollTo(0, 1);
            } catch (e) {}
        }, 0);
        window.onVideoEnd = function onVideoEnd() {
            $("#close-video").trigger("click", [ 1, false ]);
        };
        updateUI($(".current-scene").index());
        // Set camelia main div language
        $camelia.addClass($("html").attr("lang"));
        // Set camelia main div retina display or not
        if (window.devicePixelRatio && window.devicePixelRatio >= 2) $camelia.addClass("retina");
        // Flash detection
        $("html").addClass(typeof swfobject !== "undefined" && swfobject.getFlashPlayerVersion().major !== 0 ? "flash" : "no-flash");
        // Desktop only detection
        $("html").addClass(BrowserDetect.OS === "Windows" || BrowserDetect.OS === "Mac" ? "desktop" : "");
        // Firefox mac special css rule
        if (BrowserDetect.browser === "Firefox" && BrowserDetect.OS === "Mac") {
            $("#camelia #intro li.separator").css("margin-top", "4px");
        }
        /*==========================================*/
        /*                 EVENTS                   */
        /*==========================================*/
        $arrows.each(function() {
            $(this).click(function() {
                moveSlider($(this).data("direction"));
                updateUI($(".current-scene").index());
                return false;
            });
        });
        $(document).bind("keydown", function(e) {
            if ($("object#flashcontent").size() === 0 && $("#flashcontent video").size() === 0) {
                if (e.keyCode == 37) {
                    moveSlider("left");
                } else if (e.keyCode == 39) {
                    // Manually add limitation
                    if (!$("#scene-6").hasClass("current-scene")) moveSlider("right");
                }
                updateUI($(".current-scene").index());
            }
        });
        $("#explore-garden").click(function() {
            moveSlider("right");
            updateUI($(".current-scene").index());
            return false;
        });
        $(".watch-movie").bind("click", function(e) {
            e.preventDefault();
            // Disable gesture
            if (supportsTouch) {
                myScroll.disable();
            }
            $sceneVideo.delay(200).fadeIn(1, function() {
                initVideo();
                updateUI(0);
                $scenes.hide();
            });
            /*=== Stats ====*/
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, "FJ Jardin Camelias", "FJ Jardin Camelias " + $(this).data("location") + " TheFilm_Click", 50);
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, "FJ Jardin Camelias", "FJ Jardin Camelias TheFilm_View", "0");
            // Change ch_scat2 for film page (for flash player)
            $("#ch_scat2").val("FJ Jardin Camelias TheFilm");
            /*=== /Stats ===*/
            // Show logo (if on last scene for purpose)
            $("#logo").show();
            // Change logo class for stats
            $("#logo").addClass("theFilm");
            $("#logo").removeClass("homepage");
        });
        $("#close-video").bind("click", function(e, timeout, goHome) {
            e.preventDefault();
            var timeout = timeout ? timeout : 250;
            var goHome = goHome ? goHome : false;
            if (goHome) {
                $("#back-to-site-cross").trigger("click", [ 1 ]);
            } else {
                updateUI($(".current-scene").index());
            }
            if (!platform.isDesktop) {
                $scenes.show();
            }
            setTimeout(function() {
                // Change ch_scat2 for film page (for flash player)
                $("#ch_scat2").val("FJ Jardin Camelias");
                // Change logo class for stats
                $("#logo").removeClass("theFilm");
                $("#logo").addClass("homepage");
                if (platform.isDesktop) {
                    $scenes.show();
                }
                $("#scene-video").hide();
                // Delete video node (flash or html5)
                if (platform.isFlash) {
                    if ($("object#flashcontent").length) {
                        $("object#flashcontent").remove();
                        $("#scene-video").append('<div id="flashcontent">' + videoLink + "</div>");
                    }
                } else {
                    if ($("#flashcontent video")) {
                        $("#flashcontent video, #flashcontent div").remove();
                        $("#flashcontent").append(videoLink);
                    }
                }
                // Unbind and clear logo hiding on video page
                $(document).unbind("mousemove click");
                // Clear logo hiding
                clearTimeout(cameliaTimeout.logoHide);
                $(document).unbind("mousemove touchstart");
                // Enable gesture
                if (supportsTouch) {
                    myScroll.enable();
                }
            }, timeout);
        });
        $("#logo").bind("click", function(e) {
            var page = "";
            var theFilm = "";
            if ($(this).hasClass("homepage")) {
                page = "Homepage";
                theFilm = "";
            } else if ($(this).hasClass("theFilm")) {
                page = "TheFilm";
                theFilm = " TheFilm";
            }
            e.preventDefault();
            /*=== Stats ====*/
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, "FJ Jardin Camelias" + theFilm, "FJ Jardin Camelias " + page + " ChanelLogo_Click", 50);
            /*=== /Stats ===*/
            var href = $(this).find("a").attr("href");
            window.setTimeout(function() {
                window.location = href;
            }, 500);
        });
        $("#back-to-site").bind("click", function(e) {
            e.preventDefault();
            /*=== Stats ====*/
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, "FJ Jardin Camelias", "FJ Jardin Camelias " + $(this).data("location") + " BackHJ_Click", 50);
            /*=== /Stats ===*/
            var href = $(this).attr("href");
            window.setTimeout(function() {
                window.location = href;
            }, 500);
        });
        $("#back-to-site-cross").bind("click", function(e, transition) {
            e.preventDefault();
            var time = transition ? transition : 1750;
            $(".scene").removeClass("current-scene");
            $(".scene").eq(0).addClass("current-scene");
            currentPosition = $(".current-scene").index();
            updateUI(currentPosition);
            updatePosition(currentPosition, time, true);
        });
        /* 
		 * Drag and drop support with iScroll
		 */
        if (supportsTouch) {
            myScroll = new iScroll("scenes", {
                hScrollbar: false,
                vScrollbar: false,
                hScroll: true,
                vScroll: false,
                momentum: true,
                bounce: false,
                snap: "li",
                onScrollStart: function() {
                    window.clearTimeout(magnetize);
                    if (has3d) {
                        var matrix = matrixToArray(getTransformValue($scroller));
                        currentPosition = Math.abs(matrix[4].split("px")[0]);
                    } else {
                        $scroller.stop(true, false);
                        currentPosition = Math.abs($scroller.css("margin-left").split("px")[0]);
                    }
                },
                onScrollEnd: function() {
                    window.clearTimeout(changePos);
                    window.clearTimeout(magnetize);
                    changePos = setTimeout(function() {
                        if (has3d) {
                            var matrix = matrixToArray(getTransformValue($scroller));
                            currentPosition = Math.abs(matrix[4].split("px")[0]);
                        } else {
                            currentPosition = Math.abs($scroller.css("margin-left").split("px")[0]);
                        }
                        for (var i = 0, len = positionsPx.length; i < len; i++) {
                            if (currentPosition >= positionsPx[i]) {
                                $(".scene").removeClass("current-scene");
                                $(".scene").eq(i).addClass("current-scene");
                            }
                        }
                        currentScene = $(".current-scene").index();
                        updateUI(currentScene);
                    }, 750);
                    magnetize = setTimeout(function() {
                        updatePosition(currentScene, 1750);
                    }, 750);
                }
            });
        }
        /*==========================================*/
        /*                FUNCTIONS                 */
        /*==========================================*/
        /**
		 * Check slider movements
		 * @param direction
		 */
        function moveSlider(direction) {
            var currentPosition = $(".current-scene").index();
            var nextIndex;
            $(".scene").removeClass("current-scene");
            if (direction === "left") {
                nextIndex = currentPosition - 1;
                if (nextIndex <= 0) nextIndex = 0;
            } else if (direction === "right") {
                nextIndex = currentPosition + 1;
                if (nextIndex >= nbScene) nextIndex = nbScene - 1;
            }
            $(".scene").eq(nextIndex).addClass("current-scene");
            currentPosition = $(".current-scene").index();
            updatePosition(currentPosition, 1750);
        }
        /**
		 * 
		 * @param {type} index
		 * @param {type} speed
		 * @param {type} noStats
		 */
        function updatePosition(index, speed, noStats) {
            var distance = 100 * positions[index];
            sliderTranslation(distance, speed);
            /* Page stats */
            if (!noStats) {
                switch (index) {
                  case 1:
                    stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, "FJ Jardin Camelias", "FJ Jardin Camelias Page 1_View", "0");
                    break;

                  case 2:
                    stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, "FJ Jardin Camelias", "FJ Jardin Camelias Page 2_View", "0");
                    break;

                  case 3:
                    stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, "FJ Jardin Camelias", "FJ Jardin Camelias Page 3_View", "0");
                    break;

                  case 4:
                    stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, "FJ Jardin Camelias", "FJ Jardin Camelias Page 4_View", "0");
                    break;

                  case 5:
                    stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, "FJ Jardin Camelias", "FJ Jardin Camelias Page 5_View", "0");
                    break;

                  default:
                    break;
                }
            }
        }
        /**
		 * Change CSs properties to move the main scene
		 * @param distance change slider position
		 * @param speed transition speed in milliseconds
		 */
        function sliderTranslation(distance, speed) {
            if (has3d) {
                speed = Math.abs(parseFloat(speed / 1e3));
                $scroller.css({
                    "-webkit-transition": "all " + speed + "s ease-out",
                    "-o-transition": "all " + speed + "s ease-out",
                    "-ms-transition": "all " + speed + "s ease-out",
                    "-moz-transition": "all " + speed + "s ease-out",
                    transition: "all " + speed + "s ease-out",
                    "-webkit-transform": "translate3d(" + -distance + "%,0,0)",
                    "-o-transform": "translate3d(" + -distance + "%,0,0)",
                    "-ms-transform": "translate3d(" + -distance + "%,0,0)",
                    "-moz-transform": "translate3d(" + -distance + "%,0,0)",
                    transform: "translate3d(" + -distance + "%,0,0)"
                });
                setTimeout(function() {
                    $scroller.css({
                        "-webkit-transition": "all " + 0 + "s ease-out",
                        "-o-transition": "all " + 0 + "s ease-out",
                        "-ms-transition": "all " + 0 + "s ease-out",
                        "-moz-transition": "all " + 0 + "s ease-out",
                        transition: "all " + 0 + "s ease-out"
                    });
                }, 1);
            } else {
                $scroller.stop(true, false).animate({
                    "margin-left": "-" + distance + "%"
                }, speed);
            }
        }
        function getTransformValue(node) {
            if (node.css("-webkit-transform")) {
                return node.css("-webkit-transform");
            } else if (node.css("-o-transform")) {
                return node.css("-o-transform");
            } else if (node.css("-ms-transform")) {
                return node.css("-ms-transform");
            } else if (node.css("-moz-transform")) {
                return node.css("-moz-transform");
            } else if (node.css("transform")) {
                return node.css("transform");
            }
        }
        function updateUI(currentPosition) {
            var prev = $("#prev");
            var next = $("#next");
            if (currentPosition <= 0) {
                $("#prev:visible, #next:visible, #goto-video .watch-movie, #back-to-site-cross").fadeOut(500);
                $("#back-to-site").fadeIn(500);
                $("#back-to-site").data("location", "Homepage");
            } else if (currentPosition >= nbScene - 1) {
                $("#prev:hidden").fadeIn(500);
                $("#next:visible").fadeOut(500);
                $("#goto-video .watch-movie, #back-to-site-cross").fadeIn(500);
            } else {
                $("#prev:hidden, #next:hidden, #goto-video .watch-movie, #back-to-site-cross").fadeIn(500);
                $("#goto-video #back-to-site").fadeOut(500);
            }
            if (hideLogoPositions[currentPosition] === 1) {
                $("#logo:visible").stop(true, true).fadeOut(250);
            } else {
                $("#logo:hidden").stop(true, true).fadeIn(250);
            }
        }
        /**
		 * Init video player once
		 */
        function initVideo() {
            if (platform.isFlash) {
                initFlashPlayer();
            } else {
                initVideoPlayer();
            }
        }
        /*
		 * Init video player and controls
		 */
        function initVideoPlayer() {
            // INNER HTML HTML5 PLAYER :: MUST EXECUTED FIRST
            $("#flashcontent").hide();
            displayVideoPlayer("flashcontent", "camelia", true);
            // INIT VARS
            var $videoCamelia = $("#flashcontent video");
            var $flashcontent = $("#flashcontent");
            var $chanelVideoBigplay = $(".chanel-video-bigplay");
            var $iosPoster = $("#iOS-poster");
            var $logo = $("#logo");
            var $closeVideo = $("#close-video");
            var videoCamelia = $videoCamelia[0];
            var $areaReact = null;
            var firstPlayTimeout = 250;
            // SET TIMEOUT TO HIDE QUICK TIME LOGO
            // DEFAULT VALUES
            $flashcontent.append("<div class='area-react'></div>");
            $areaReact = $(".area-react");
            $flashcontent.width($camelia.width()).height($camelia.height());
            $flashcontent.show();
            if (platform.isIphone) {
                $videoCamelia.css({
                    right: "-99999px",
                    top: "-99999px"
                });
            }
            $chanelVideoBigplay.show();
            $iosPoster.show();
            var eventSended = {
                start: false,
                ended: false,
                p25: false,
                p50: false,
                p75: false
            };
            // EVENTS CALLBACKS
            var videoCameliaPause = function videoCameliaPause() {
                $chanelVideoBigplay.show();
                $iosPoster.show();
                $logo.stop(false, true).show();
                $closeVideo.stop(false, true).show();
            };
            var videoCameliaPlay = function videoCameliaPlay() {
                // TO HIDE QUICKTIME LOGO ON FIRST PLAY
                setTimeout(function() {
                    if (!platform.isIphone) {
                        $chanelVideoBigplay.hide();
                        $iosPoster.css("opacity", 0).hide();
                        $logo.fadeOut(1e3);
                        $closeVideo.fadeOut(1e3);
                    }
                    if (!eventSended.start) {
                        /*=== Stats ====*/
                        stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, "FJ Jardin Camelias TheFilm", "FJ Jardin Camelias TheFilm_000%", 50);
                        /*=== /Stats ===*/
                        eventSended.start = true;
                    }
                    firstPlayTimeout = 1;
                }, firstPlayTimeout);
            };
            var videoCameliaEnded = function videoCameliaEnded() {
                $chanelVideoBigplay.hide();
                $logo.stop(false, true).hide();
                $closeVideo.stop(false, true).hide();
                $iosPoster.hide();
                if (!eventSended.ended) {
                    /*=== Stats ====*/
                    stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, "FJ Jardin Camelias TheFilm", "FJ Jardin Camelias TheFilm_100%", 50);
                    /*=== /Stats ===*/
                    eventSended.ended = true;
                }
                // TRIGGER WINDOW CLOSE VIDEO
                window.onVideoEnd();
            };
            var videoCameliaTimeupdate = function videoCameliaTimeupdate() {
                var current = this.currentTime, total = this.duration, ratio = current * 100 / total;
                if (ratio > 25 && !eventSended.p25) {
                    /*=== Stats ====*/
                    stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, "FJ Jardin Camelias TheFilm", "FJ Jardin Camelias TheFilm_025%", 50);
                    /*=== /Stats ===*/
                    eventSended.p25 = true;
                } else if (ratio > 50 && !eventSended.p50) {
                    /*=== Stats ====*/
                    stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, "FJ Jardin Camelias TheFilm", "FJ Jardin Camelias TheFilm_050%", 50);
                    /*=== /Stats ===*/
                    eventSended.p50 = true;
                } else if (ratio > 75 && !eventSended.p75) {
                    /*=== Stats ====*/
                    stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, ch_scat1, "FJ Jardin Camelias TheFilm", "FJ Jardin Camelias TheFilm_075%", 50);
                    /*=== /Stats ===*/
                    eventSended.p75 = true;
                }
            };
            var areaReactClick = function areaReactClick(e) {
                e.stopPropagation();
                if (videoCamelia) {
                    if (!videoCamelia.paused || videoCamelia.ended) {
                        videoCamelia.pause();
                    } else {
                        videoCamelia.play();
                    }
                }
            };
            // EVENTS
            videoCamelia.addEventListener("pause", videoCameliaPause);
            videoCamelia.addEventListener("play", videoCameliaPlay);
            videoCamelia.addEventListener("ended", videoCameliaEnded);
            videoCamelia.addEventListener("timeupdate", videoCameliaTimeupdate);
            $areaReact.unbind("click").bind("click", areaReactClick);
            $chanelVideoBigplay.unbind("click").bind("click", areaReactClick);
            // Try to autoplay
            try {
                videoCamelia.addEventListener("loadstart", function() {
                    setTimeout(function() {
                        videoCamelia.play();
                    }, 1e3);
                });
            } catch (e) {}
        }
        /*
		 * Init video player and controls
		 */
        function initFlashPlayer() {
            var params = {
                quality: "high",
                scale: "noscale",
                wmode: "transparent",
                allowFullScreen: "true",
                allowscriptaccess: "always",
                bgcolor: "#000000"
            };
            var flashvars = {
                urlflv: vidUrl,
                color: "0x000000",
                urlimg: path_site + "assets/jardin_de_camelias/video/jardin-de-camelia-fr.jpg",
                lang: sitelocEncoded.split("/")[0]
            };
            var attributes = {
                id: "flashcontent",
                name: "flashcontent"
            };
            swfobject.embedSWF(path_site + "template/swf/PlayerVideoStream.swf?_=" + ~~(Math.random() * 1e5), "flashcontent", "100%", "100%", "9.0.124", path_site + "_swf/expressInstall.swf", flashvars, params, attributes);
            setLogoTimeout(4e3);
            if (platform.isFFMac) {
                $("#flashcontent").after("<div class='area-react'></div>");
                $(".area-react").bind("mousemove", function() {
                    $(this).hide();
                    setTimeout(function() {
                        $(".area-react").show();
                    }, 2e3);
                    if (allowEvent) {
                        allowEvent = false;
                        clearTimeout(cameliaTimeout.mouseMove);
                        $("#logo, #close-video").show();
                        setLogoTimeout(5e3);
                        setTimeout(function() {
                            allowEvent = true;
                        }, 250);
                    }
                });
            } else {
                /* Logo behaviour */
                $(document).on("mousemove click", function(e) {
                    e.preventDefault();
                    if (allowEvent) {
                        allowEvent = false;
                        clearTimeout(cameliaTimeout.mouseMove);
                        $("#logo, #close-video").show();
                        setLogoTimeout(2e3);
                        setTimeout(function() {
                            allowEvent = true;
                        }, 250);
                    }
                });
            }
        }
        /*
		 * 
		 * @param {type} time
		 * @returns {undefined}
		 */
        function setLogoTimeout(time) {
            $("#logo, #close-video").show();
            $sceneVideo.stop().css("background-color", "#FFFFFF");
            clearTimeout(cameliaTimeout.logoHide);
            cameliaTimeout.logoHide = setTimeout(function() {
                $("#logo, #close-video").fadeOut(1e3);
                if (platform.isFlash) $sceneVideo.animate({
                    backgroundColor: "#000000"
                }, 1e3);
            }, time);
        }
        /*
		 * 
		 * @returns {Boolean}
		 */
        function isHighRes() {
            return chanelFW.resVersion == "Big";
        }
        /**
		 * Transform a matrix to an array
		 * @param matrix the input matrix
		 */
        function matrixToArray(matrix) {
            return matrix.substr(7, matrix.length - 8).split(", ");
        }
        /**
		 * Test if browser support 3dtransform
		 */
        function has3d() {
            var el = document.createElement("p"), has3d, transforms = {
                webkitTransform: "-webkit-transform",
                OTransform: "-o-transform",
                msTransform: "-ms-transform",
                MozTransform: "-moz-transform",
                transform: "transform"
            };
            // Add it to the body to get the computed style.
            document.body.insertBefore(el, null);
            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = "translate3d(1px,1px,1px)";
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }
            document.body.removeChild(el);
            return has3d !== undefined && has3d.length > 0 && has3d !== "none";
        }
        /**
		 * IE polyfill for addEventListener
		 * 
		 * @param {type} el
		 * @param {type} eventName
		 * @param {type} eventHandler
		 * @returns {undefined}
		 */
        function bindEvent(el, eventName, eventHandler) {
            if (el.addEventListener) {
                el.addEventListener(eventName, eventHandler, false);
            } else if (el.attachEvent) {
                el.attachEvent("on" + eventName, eventHandler);
            }
        }
        /**
		 * 
		 * @returns {unresolved}
		 */
        function isFirefoxMac() {
            return navigator.userAgent.indexOf("Firefox") != -1 && navigator.userAgent.indexOf("Mac") != -1;
        }
        /*==========================================*/
        /*                ANIMATIONS                */
        /*==========================================*/
        var imgLoaded = 0;
        var totalImg = $(".camelia-image").length;
        /* Remove loader once images are loaded */
        $(".camelia-image").imageloader({
            background: true,
            callback: function(el) {
                imgLoaded++;
                // Go ahead once all images are fully loaded
                if (totalImg === imgLoaded) {
                    // Remove loader
                    $("#loader").fadeOut("fast");
                }
            }
        });
        var i;
        for (i in document.images) {
            if (document.images[i].src) {
                var imgSrc = document.images[i].src;
                if (imgSrc.substr(imgSrc.length - 4) === ".png" || imgSrc.substr(imgSrc.length - 4) === ".PNG") {
                    document.images[i].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='crop',src='" + imgSrc + "')";
                }
            }
        }
        // EVENTS CALLBACKS
        var scene1MouseOver = function scene1MouseOver(e) {
            $(this).addClass("hover");
        };
        var scene1MouseOut = function scene1MouseOut(e) {
            $(this).removeClass("hover");
        };
        // EVENTS
        $scene1.unbind("mouseover", scene1MouseOver).find("li:not(.separator)").bind("mouseover", scene1MouseOver);
        $scene1.unbind("mouseout", scene1MouseOut).find("li:not(.separator)").bind("mouseout", scene1MouseOut);
        return _this;
    };
    _m_ = _super.jardins_camelias;
})(WFJ.module, jQuery);

(function(_super, $) {
    _super.leftblock = function leftblock() {
        var _this = this, $collectionLinks = $("#menuleft, #menuleftbottom").find(".subsections");
        $allLinksMenu = $("#menuleft a");
        var slide_subsections = function slide_subsections(transition, isActive) {
            var $menuLeft = $("#menuleft, #menuleftbottom");
            var time = transition ? transition : 500;
            if (isActive) {
                $menuLeft.find("li").find("ul").slideUp(time);
                $menuLeft.find("li.active").removeClass("active");
            } else {
                $menuLeft.find("li:not(.active)").find("ul").slideUp(time);
                $menuLeft.find("li.active").find("ul").slideDown(time);
            }
        };
        var subsectionsClick = function subsectionsClick(e) {
            e.preventDefault();
            var $this = $(this);
            var isActive = $this.parent().hasClass("active");
            if ($(this).hasClass("link-collections")) {
                return;
            }
            $collectionLinks.parent("li").removeClass("active");
            $this.parent("li").addClass("active");
            slide_subsections(500, isActive);
        };
        $(".subsection").find("li.active").parent().parent().removeClass("active").addClass("active");
        slide_subsections(1);
        // OPEN ACTIVE SUBSECTION ON DOCUMENT READY
        var sendTags = function sendTags(e) {
            e.preventDefault();
            var $this = $(this);
            var data = $this.data("tag").toString();
            var arr = data.split("/");
            var dataJoin = arr.join("_");
            var productName;
            if (arr.length == 2) {
                productName = "_" + arr[0];
            } else {
                productName = " ";
            }
            var data = {
                title: dataJoin,
                sectionJoa: "FJ ",
                sectionHorlo: "W "
            };
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, data[section === "watches" ? "sectionHorlo" : "sectionJoa"] + "Leftnav " + DEVICE_TYPE, data[section === "watches" ? "sectionHorlo" : "sectionJoa"] + "Leftnav" + productName, data[section === "watches" ? "sectionHorlo" : "sectionJoa"] + "Menu_" + data.title + "_Click", "50", $("#product_ref").val());
            setTimeout(function() {
                if ($this.attr("href").indexOf("#") == -1) {
                    location.href = $this.attr("href");
                }
            }, 500);
        };
        // SET EVENTS
        $collectionLinks.unbind("click", subsectionsClick).bind("click", subsectionsClick);
        $allLinksMenu.unbind("click", sendTags).bind("click", sendTags);
        return _this;
    };
})(WFJ.module, jQuery);

/*
 * sample module
 */
(function(_super, $) {
    var _m_;
    _super.not_found = function() {
        var _this = this;
        var $back = $(".back_label span");
        var backClick = function backClick(e) {
            window.history.back();
        };
        $back.off("click", backClick).on("click", backClick);
        return _this;
    };
    _m_ = _super.sample;
})(WFJ.module, jQuery);

/*
 * ooyala video player
 */
(function(_super, $) {
    var _m_;
    _super.ooyala = function() {
        var _this = this;
        return _this;
    };
    _m_ = _super.ooyala;
    _m_.callback = function(name, args) {
        var player = WFJ.module.ooyala.player;
        switch (name) {
          case "playbackReady":
            // small tempo, sometimes ooyala player is not really ready
            setTimeout(function() {
                player.create();
            }, 500);
            break;

          case "initialPlay":
            player.play();
            break;

          case "play":
            player.play();
            break;

          case "playheadTimeChanged":
            player.playheadTimeChanged(args[0], args[1]);
            break;

          case "pause":
            player.pause();
            if (DEVICE_TYPE !== "desktop") {
                $(".btn_play").show();
            }
            break;

          case "played":
            player.played();
            break;
        }
    };
    var $player;
    var $chanelOocontrols;
    var $chanelOocontrolsPP;
    var $chanelOocontrolsShare;
    var $chanelOocontrolsShareUL;
    var $chanelOocontrolsBar;
    var $chanelOocontrolsCurrentMM;
    var $chanelOocontrolsCurrentSS;
    var isFullscreen;
    var sizeVideo;
    var $body;
    // size of all videos [width, height]
    var sizes = {
        Small: {
            popin: [ 1e3, 551 ],
            whats_new: [ 766, 360 ],
            mediaplayer: [ 636, 377 ],
            mediaplayer_article: [ 382, 234 ],
            collections: [ 670, 433 ]
        },
        Big: {
            popin: [ 1256, 726 ],
            whats_new: [ 1022, 505 ],
            mediaplayer: [ 848, 497 ],
            mediaplayer_article: [ 636, 377 ],
            collections: [ 893, 544 ]
        }
    };
    _m_.player = {
        initialized: false,
        init: function(options) {
            if (this.initialized) {
                this.destroy();
            }
            options = options || {};
            var context = options.context || "popin";
            var self = this;
            sizeVideo = sizes[WFJ.resVersion][context];
            $body = jQuery("body");
            isFullscreen = $body[0].requestFullScreen || $body[0].webkitRequestFullScreen || $body[0].mozRequestFullScreen;
            $player = $("#playerContainer");
            $chanelOocontrols = $("#chanel-oocontrols");
            $chanelOocontrolsPP = $chanelOocontrols.find(".pp");
            $chanelOocontrolsShare = $chanelOocontrols.find(".share");
            $chanelOocontrolsShareUL = $chanelOocontrolsShare.find("ul");
            $chanelOocontrolsBar = $chanelOocontrols.find(".timeline .bar");
            $chanelOocontrolsCurrentMM = $chanelOocontrols.find(".current_time .mm");
            $chanelOocontrolsCurrentSS = $chanelOocontrols.find(".current_time .ss");
            var controlH = $chanelOocontrols.outerHeight();
            // hide controls on mobile
            if (DEVICE_TYPE === "mobile") {
                $chanelOocontrols.hide();
            }
            var playerOptions = {
                width: sizeVideo[0],
                height: sizeVideo[1] - controlH,
                rootelement: "playerContainer",
                video: $player.data("videoid"),
                autoplay: 1,
                eventfct: "WFJ.module.ooyala.callback",
                sp: "0",
                sr: "0",
                de: "0",
                cls: "1",
                // Chromeless : Hide Controls
                ll: 3,
                sbsn: "no",
                sn: "no",
                sbm: "no",
                sbc: "#7f7f7f",
                sbbc: "#666666",
                pl: window.locale,
                dc: "1",
                cl: window.locale,
                lw: ""
            };
            // show play button on mobile and tablet
            if (DEVICE_TYPE !== "desktop") {
                playerOptions["sp"] = 1;
                playerOptions["autoplay"] = 0;
            }
            coop.create(playerOptions);
            var windowResize = function() {
                if ($chanelOocontrols.hasClass("chanel-oocontrols-fullscreen")) {
                    return false;
                }
                setTimeout(function() {
                    sizeVideo = sizes[WFJ.resVersion][context];
                    var $playerContainer = $("#playerContainer");
                    var height = sizeVideo[1] - controlH;
                    var width = sizeVideo[0];
                    $playerContainer.css({
                        width: width,
                        height: height
                    });
                    $playerContainer.find(".innerWrapper").css({
                        width: width,
                        height: height
                    });
                    // center play button and loading
                    var containerWidth = $playerContainer.outerWidth();
                    var containerHeight = $playerContainer.outerHeight();
                    $playerContainer.find(".btn_play").css({
                        top: containerHeight / 2 - 32,
                        left: containerWidth / 2 - 32
                    });
                    self.placeLoader();
                }, 10);
            };
            // bind share on init
            if (DEVICE_TYPE === "tablet") {
                $chanelOocontrolsShare.on("click", function(e) {
                    e.preventDefault();
                    $chanelOocontrolsShareUL.toggleClass("active");
                });
            } else {
                $chanelOocontrolsShare.on("mouseenter", function(e) {
                    e.preventDefault();
                    $chanelOocontrolsShareUL.addClass("active");
                });
                $chanelOocontrolsShare.on("mouseleave", function(e) {
                    e.preventDefault();
                    $chanelOocontrolsShareUL.removeClass("active");
                });
            }
            $("body").off("window:changeresize", windowResize).on("window:changeresize", windowResize);
        },
        create: function() {
            if (this.initialized) {
                return false;
            }
            this.initialized = true;
            var self = this;
            var player = window.chanel_player_playerContainer;
            var duration = player.getDuration();
            var iOS = navigator.userAgent.match(/(iPhone|iPod)/i);
            var containerWidth = $player.outerWidth();
            var containerHeight = $player.outerHeight();
            var playerContainer = $("#playerContainer");
            var buffering_wheel = playerContainer.find(".buffering_wheel");
            self.placeLoader();
            setTimeout(function() {
                var motio = new Motio(buffering_wheel.get(0), {
                    fps: 14.28,
                    frames: 12,
                    width: buffering_wheel.width(),
                    height: buffering_wheel.height()
                });
                motio.play();
            }, 0);
            // fullscreenChanged event
            player.mb.subscribe(oo_playerContainer.EVENTS.FULLSCREEN_CHANGED, "keynote", function() {
                // if exiting fullscreen
                if (player.fullscreen === false) {
                    $("#closePopinBtn").show();
                    $chanelOocontrols.removeClass("chanel-oocontrols-fullscreen");
                    $player.removeClass("fullscreen");
                    $chanelOocontrols.find(".timeline .bar, #box-chapter-hover, #box-chapter-current").css({
                        width: ""
                    });
                    $player.css({
                        zIndex: ""
                    });
                    if (DEVICE_TYPE === "mobile") {
                        $player.find(".btn_play, .preview").show();
                        $player.find(".btn_play").css({
                            top: containerHeight / 2 - 32,
                            left: containerWidth / 2 - 32
                        });
                        $player.find(".video").css({
                            left: "-10000px"
                        });
                    }
                } else {
                    $("#closePopinBtn").hide();
                    $chanelOocontrols.addClass("chanel-oocontrols-fullscreen");
                    $player.addClass("fullscreen");
                    $chanelOocontrols.find(".timeline .bar, #box-chapter-hover, #box-chapter-current").css({
                        width: screen.width - 216
                    });
                    $player.find(".btn_play, .buffering_wheel").css({
                        left: "",
                        top: ""
                    });
                }
                self.placeLoader();
            });
            player.mb.subscribe(oo_playerContainer.EVENTS.PLAYED, "keynote", function() {
                $player.find(".btn_play").show();
            });
            var setTotalDuration = function() {
                var minutes = "00";
                var secondes = "00";
                if (duration > 60) {
                    minutes = Math.floor(duration / 60);
                    secondes = Math.floor(duration - 60 * minutes);
                } else {
                    minutes = 0;
                    secondes = Math.floor(duration);
                }
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (secondes < 10) {
                    secondes = "0" + secondes;
                }
                $chanelOocontrols.find(".total_time .mm").html(minutes);
                $chanelOocontrols.find(".total_time .ss").html(secondes);
            };
            // TICKET 16667
            /* if (DEVICE_TYPE === 'tablet') {
                var video = $('#mediaplayer').find('video');

                if (video.length) {
                    video[0].addEventListener('loadedmetadata', function() {
                        duration = video[0].duration;
                        setTotalDuration();
                    });
                }
            } else {
            }*/
            setTotalDuration();
            $chanelOocontrolsPP.on("click", function(e) {
                e.preventDefault();
                if (player.state == "playing") {
                    player.pauseMovie();
                } else {
                    player.playMovie();
                }
            });
            $chanelOocontrols.find(".fullscreen").on("click", function(e) {
                e.preventDefault();
                var $fullscreenButton;
                if (isFullscreen) {
                    $fullscreenButton = $player.find(".full_screen");
                } else {
                    // if exiting fullscreen
                    if ($chanelOocontrols.hasClass("fullscreen")) {
                        $body.removeClass("fullscreen");
                        $chanelOocontrols.find(".timeline .bar, #box-chapter-hover, #box-chapter-current").css({
                            width: ""
                        });
                        $player.css({
                            zIndex: ""
                        });
                    } else {
                        $body.addClass("fullscreen");
                        $player.find(".btn_play, .buffering_wheel").css({
                            left: "",
                            top: ""
                        });
                    }
                    $chanelOocontrols.toggleClass("fullscreen");
                    $fullscreenButton = $player.find(".fullpage");
                    self.placeLoader();
                }
                $fullscreenButton.trigger("click");
            });
            player.setVolume(.5);
            $chanelOocontrols.find(".volume").slider({
                range: "min",
                value: 50,
                change: function(e, ui) {
                    player.setVolume(ui.value / 100);
                }
            });
            $chanelOocontrolsBar.slider({
                range: "min",
                value: 0,
                step: .1,
                stop: function(e, ui) {
                    player.seek(ui.value * duration / 100);
                }
            });
            if (iOS) {
                $("#playerContainer").find(".buffering_wheel").remove();
            }
        },
        played: function() {
            $chanelOocontrolsPP.removeClass("pause").addClass("play");
            $chanelOocontrolsCurrentMM.html("00");
            $chanelOocontrolsCurrentSS.html("00");
            $chanelOocontrolsBar.slider("value", 0);
        },
        play: function() {
            $chanelOocontrolsPP.removeClass("play").addClass("pause");
        },
        playheadTimeChanged: function(current, duration) {
            if (!this.initialized) {
                return false;
            }
            current = !current ? 0 : current;
            //            var player = window.chanel_player_playerContainer;
            //            var duration = player.getDuration();
            //            var current = player.getPlayheadTime();
            //            var oocontrols = $('#chanel-oocontrols');
            var percents = current * 100 / duration;
            $chanelOocontrolsBar.slider("value", percents);
            if (Math.floor(current) > 0) {
                var minutes = "00";
                var secondes = "00";
                if (current > 60) {
                    minutes = Math.floor(current / 60);
                    secondes = Math.floor(current - 60 * minutes);
                } else {
                    minutes = 0;
                    secondes = Math.floor(current);
                }
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (secondes < 10) {
                    secondes = "0" + secondes;
                }
                $chanelOocontrolsCurrentMM.html(minutes);
                $chanelOocontrolsCurrentSS.html(secondes);
            }
        },
        pause: function() {
            $chanelOocontrolsPP.removeClass("pause").addClass("play");
        },
        placeLoader: function placeLoader() {
            // byPass placeLoader
            return;
            var that = this;
            // defer
            setTimeout(function() {
                $("#playerContainer").find(".buffering_wheel").show().css({
                    left: "50%",
                    top: "50%",
                    marginLeft: -($(".buffering_wheel").width() / 2),
                    marginTop: -($(".buffering_wheel").height() / 2)
                });
            }, 0);
        },
        destroy: function() {
            this.initialized = false;
            window.chanel_player_playerContainer.destroy();
        }
    };
})(WFJ.module, jQuery);

/*
 * sample module
 */
(function(_super, $) {
    var _m_;
    _super.ooyala_chapters = function() {
        var _this = this;
        return _this;
    };
    _m_ = _super.ooyala_chapters;
    _m_.init = function() {
        var _this = this;
        $(".goToVideo").on("click", function(e) {
            e.preventDefault();
            _this.popin.get({
                time: $(this).data("time")
            });
        });
    };
    _m_.callback = function(name, args) {
        var player = WFJ.module.ooyala_chapters.player;
        switch (name) {
          case "initialPlay":
            player.play();
            break;

          case "play":
            player.play();
            break;

          case "playheadTimeChanged":
            player.playheadTimeChanged(args[0], args[1]);
            break;

          case "pause":
            player.pause();
            break;

          case "played":
            player.played();
            break;
        }
    };
    // size of all videos [width, height]
    var sizes = {
        Small: [ 1e3, 473 ],
        Big: [ 1256, 670 ]
    };
    var chaptersTimes = [];
    var isFullscreen;
    _m_.player = {
        initialized: false,
        init: function() {
            if (this.initialized) {
                this.destroy();
            }
            var self = this;
            var player = window.chanel_player_playerContainer;
            var duration = player.getDuration();
            var current = player.getPlayheadTime();
            var oocontrols = $("#chanel-oocontrols");
            var playerContainer = $("#playerContainer");
            var $body = jQuery("body");
            isFullscreen = $body[0].requestFullScreen || $body[0].webkitRequestFullScreen || $body[0].mozRequestFullScreen;
            var iOS = navigator.userAgent.match(/(iPhone|iPod)/i);
            var buffering_wheel = playerContainer.find(".buffering_wheel");
            this.placeLoader();
            setTimeout(function() {
                var motio = new Motio(buffering_wheel.get(0), {
                    fps: 14.28,
                    frames: 12,
                    width: buffering_wheel.width(),
                    height: buffering_wheel.height()
                });
                motio.play();
            }, 0);
            if (iOS) {
                oocontrols.hide();
            }
            // fullscreenChanged event
            player.mb.subscribe(oo_playerContainer.EVENTS.FULLSCREEN_CHANGED, "keynote", function() {
                // if exiting fullscreen
                if (player.fullscreen === false) {
                    $("#closePopinBtn").show();
                    oocontrols.removeClass("chanel-oocontrols-fullscreen");
                    playerContainer.removeClass("fullscreen");
                    // remove width
                    oocontrols.find(".timeline .bar, #box-chapter-hover, #box-chapter-current").css({
                        width: ""
                    });
                    playerContainer.css({
                        zIndex: ""
                    });
                    if (DEVICE_TYPE === "mobile") {
                        playerContainer.find(".btn_play, .preview").show();
                        playerContainer.find(".video").css({
                            left: "-10000px"
                        });
                    }
                } else {
                    $("#closePopinBtn").hide();
                    oocontrols.addClass("chanel-oocontrols-fullscreen");
                    playerContainer.addClass("fullscreen");
                    oocontrols.find(".timeline .bar, #box-chapter-hover, #box-chapter-current").css({
                        width: screen.width - 157
                    });
                }
                self.placeLoader();
                self.posChapters();
            });
            player.mb.subscribe(oo_playerContainer.EVENTS.PLAYED, "keynote", function() {
                $("#playerContainer").find(".btn_play").show();
            });
            player.mb.subscribe(oo_playerContainer.EVENTS.PLAYING, "keynote", function() {
                if (WFJ.module.ooyala_chapters.player.initialPlayTime) {
                    window.chanel_player_playerContainer.seek(WFJ.module.ooyala_chapters.player.initialPlayTime);
                    WFJ.module.ooyala_chapters.player.initialPlayTime = null;
                }
            });
            oocontrols.find(".pp").on("click", function(e) {
                if (player.state == "playing") player.pauseMovie(); else player.playMovie();
            });
            var minutes = "00";
            var secondes = "00";
            if (duration > 60) {
                minutes = Math.floor(duration / 60);
                secondes = Math.floor(duration - 60 * minutes);
            } else {
                minutes = 0;
                secondes = Math.floor(duration);
            }
            if (minutes < 10) minutes = "0" + minutes;
            if (secondes < 10) secondes = "0" + secondes;
            $("#chanel-oocontrols .total_time .mm").html(minutes);
            $("#chanel-oocontrols .total_time .ss").html(secondes);
            oocontrols.find(".fullscreen").on("click", function(e) {
                e.preventDefault();
                var $fullscreenButton;
                if (isFullscreen) {
                    $fullscreenButton = playerContainer.find(".full_screen");
                } else {
                    // if exiting fullscreen
                    if (oocontrols.hasClass("fullscreen")) {
                        $body.removeClass("fullscreen");
                        oocontrols.find(".timeline .bar, #box-chapter-hover, #box-chapter-current").css({
                            width: ""
                        });
                        playerContainer.css({
                            zIndex: ""
                        });
                    } else {
                        $body.addClass("fullscreen");
                        oocontrols.find(".timeline .bar, #box-chapter-hover, #box-chapter-current").css({
                            width: $(window).width() - 165
                        });
                        playerContainer.find(".btn_play, .buffering_wheel").css({
                            left: "",
                            top: ""
                        });
                    }
                    self.placeLoader();
                    self.posChapters();
                    oocontrols.toggleClass("fullscreen");
                    $fullscreenButton = playerContainer.find(".fullpage");
                }
                $fullscreenButton.trigger("click");
            });
            player.setVolume(.5);
            $("#chanel-oocontrols .volume").slider({
                range: "min",
                value: 50,
                change: function(e, ui) {
                    player.setVolume(ui.value / 100);
                }
            });
            $("#chanel-oocontrols .timeline .bar").slider({
                range: "min",
                value: 0,
                step: .1,
                stop: function(e, ui) {
                    player.seek(ui.value * duration / 100);
                }
            });
            var chapters = window.film_chapters;
            var timeline = $("#chanel-oocontrols .timeline");
            var total_width = timeline.width();
            $.each(chapters, function(i, item) {
                var seconds = 0;
                if (item.time.indexOf(":") > -1) {
                    var temp = item.time.split(":");
                    seconds = parseInt(temp[0] * 60, 10) + parseInt(temp[1], 10);
                }
                chaptersTimes.push(seconds);
                var btn = $('<span class="chapter" data-time="' + seconds + '"></span>');
                var percents = seconds * 100 / duration;
                var left = percents * total_width / 100;
                btn.css("left", percents + "%").on({
                    click: function(e) {
                        player.seek(seconds);
                    },
                    mouseenter: function(e) {
                        $("#hover-content-" + seconds).fadeIn(300);
                    },
                    mouseleave: function(e) {
                        $("#box-chapter-hover .oocontrols-tooltip").fadeOut(300);
                    }
                });
                timeline.append(btn);
                self.posChapters();
            });
            if (iOS) {
                $("#playerContainer").find(".buffering_wheel").remove();
            }
            player.play();
            oocontrols.addClass("initialized");
            var windowResize = function() {
                if (oocontrols.hasClass("chanel-oocontrols-fullscreen")) {
                    self.placeLoader();
                    return false;
                }
                setTimeout(function() {
                    var sizeVideo = sizes[WFJ.resVersion];
                    var $playerContainer = $("#playerContainer");
                    var height = sizeVideo[1];
                    var width = sizeVideo[0];
                    $playerContainer.css({
                        width: width,
                        height: height
                    });
                    $playerContainer.find(".innerWrapper").css({
                        width: width,
                        height: height
                    });
                    // center play button and loading
                    var containerWidth = $playerContainer.outerWidth();
                    var containerHeight = $playerContainer.outerHeight();
                    $playerContainer.find(".btn_play").css({
                        top: containerHeight / 2 - 32,
                        left: containerWidth / 2 - 32
                    });
                    self.placeLoader();
                }, 100);
            };
            $("body").off("window:changeresize", windowResize).on("window:changeresize", windowResize);
        },
        posChapters: function() {
            var player = window.chanel_player_playerContainer;
            var duration = player.getDuration();
            var chapters = window.film_chapters;
            var timeline = $("#chanel-oocontrols .timeline");
            var total_width = timeline.width();
            $.each(chapters, function(i, item) {
                var seconds = 0;
                if (item.time.indexOf(":") > -1) {
                    var temp = item.time.split(":");
                    seconds = parseInt(temp[0] * 60, 10) + parseInt(temp[1], 10);
                }
                var percents = seconds * 100 / duration;
                var left = percents * total_width / 100;
                var p = $("#box-chapter-current p").eq(i);
                var p_width = p.width();
                var p_percents = p_width * 100 / total_width;
                var p_percents_x = percents - p_percents / 2;
                var p_x = p_percents_x + p_percents > 100 ? 100 - p_percents : p_percents_x;
                if (p_x < 0) {
                    p_x = 0;
                }
                p.css("left", p_x + "%");
                var label = $("#box-chapter-hover .oocontrols-tooltip").eq(i);
                var lbl_width = label.width();
                var lbl_percents = lbl_width * 100 / total_width;
                var lbl_percents_x = percents - lbl_percents / 2;
                var lbl_x = lbl_percents_x + lbl_percents > 100 ? 100 - lbl_percents : lbl_percents_x;
                if (lbl_x < 0) {
                    lbl_x = 0;
                }
                label.css("left", lbl_x + "%");
            });
        },
        played: function() {
            $("#chanel-oocontrols .pp").removeClass("pause").addClass("play");
            $("#chanel-oocontrols .current_time .mm").html("00");
            $("#chanel-oocontrols .current_time .ss").html("00");
            $("#chanel-oocontrols .timeline .bar").slider("value", 0);
            $("#box-chapter-current p").hide();
        },
        play: function() {
            $("#chanel-oocontrols .pp").removeClass("play").addClass("pause");
        },
        playheadTimeChanged: function(current, duration) {
            current = !current ? 0 : current;
            //            var player = window.chanel_player_playerContainer;
            //            var duration = player.getDuration();
            //            var current = player.getPlayheadTime();
            var oocontrols = $("#chanel-oocontrols");
            if (!oocontrols.hasClass("initialized")) this.init();
            var $chapters = $("#box-chapter-current").find("p");
            for (var i = 0; i < chaptersTimes.length; i++) {
                $("#box-chapter-current p").hide();
                if (current < chaptersTimes[i]) {
                    $chapters.eq(i - 1).show();
                    break;
                } else {
                    $chapters.eq(chaptersTimes.length - 1).show();
                }
            }
            var percents = current * 100 / duration;
            $("#chanel-oocontrols .timeline .bar").slider("value", percents);
            if (Math.floor(current) > 0) {
                var minutes = "00";
                var secondes = "00";
                if (current > 60) {
                    minutes = Math.floor(current / 60);
                    secondes = Math.floor(current - 60 * minutes);
                } else {
                    minutes = 0;
                    secondes = Math.floor(current);
                }
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (secondes < 10) {
                    secondes = "0" + secondes;
                }
                $("#chanel-oocontrols .current_time .mm").html(minutes);
                $("#chanel-oocontrols .current_time .ss").html(secondes);
            }
        },
        pause: function() {
            $("#chanel-oocontrols .pp").removeClass("pause").addClass("play");
            if (DEVICE_TYPE !== "desktop") {
                $(".btn_play").show();
            }
        },
        placeLoader: function placeLoader() {
            // byPass placeLoader
            return;
            var that = this;
            // defer
            setTimeout(function() {
                $("#playerContainer").find(".buffering_wheel").show().css({
                    left: "50%",
                    top: "50%",
                    marginLeft: -($(".buffering_wheel").width() / 2),
                    marginTop: -($(".buffering_wheel").height() / 2)
                });
            }, 0);
        }
    };
    _m_.popin = {
        get: function(data) {
            WFJ.module.ooyala_chapters.player.initialPlayTime = data.time;
            var tmp = $("#popin-ooyala").html();
            tmp = Handlebars.compile(tmp);
            var content = {
                back: "WFJ.module.ooyala_chapters.popin.rm();"
            };
            var html = tmp(content);
            $("#inline_popup").css("display", "block");
            $("#popin").addClass("playerPopin").css("display", "block").html(html);
            var chapters_items = "";
            $.each(film_chapters, function(i, item) {
                var seconds = 0;
                if (item.time.indexOf(":") > -1) {
                    var temp = item.time.split(":");
                    seconds = parseInt(temp[0] * 60, 10) + parseInt(temp[1], 10);
                }
                chapters_items += '<p id="oocontrols-label-' + seconds + '">' + item.label + ' <a href="javascript:void(0);" onclick="WFJ.module.ooyala_chapters.popin.more(' + seconds + ');">' + moreText + "</a></p>";
            });
            $("#box-chapter-current").html(chapters_items);
            $("#playerContainer").after($("#chapters-more-content").html());
            $("#box-chapter-hover").html($("#chapters-hover-content").html());
            // TICKET #16768
            /*			$('#chapters-more-content').html(' ');
			$('#chapters-hover-content').html(' ');*/
            var windowH = $(window).height();
            var windowW = $(window).width();
            var oo_width = 1e3;
            var oo_height = 473;
            if (windowW > 1256 && windowH > 760) {
                oo_width = 1256;
                oo_height = 670;
            }
            if (DEVICE_TYPE === "mobile") {
                oo_width = 1e3;
                oo_height = 473;
            }
            var options = {
                width: oo_width,
                height: oo_height,
                rootelement: "playerContainer",
                video: ooyala_video_id,
                autoplay: "0",
                eventfct: "WFJ.module.ooyala_chapters.callback",
                sp: "0",
                sr: "0",
                de: "0",
                cls: "1",
                // Chromeless : Hide Controls
                ll: 3,
                sbsn: "no",
                sn: "no",
                sbm: "no",
                sbc: "#7f7f7f",
                sbbc: "#666666",
                pl: window.locale,
                dc: "1",
                dpf: "0",
                cl: window.locale,
                lw: ""
            };
            // show play button on mobile and tablet
            if (DEVICE_TYPE !== "desktop") {
                options["sp"] = 1;
            }
            coop.create(options);
        },
        more: function(time) {
            $(".chapters-more-content").hide();
            $("#more-content-" + time).show();
            var player = window.chanel_player_playerContainer;
            player.pause();
        },
        close: function(time) {
            $(".chapters-more-content").hide();
            var player = window.chanel_player_playerContainer;
            player.play();
        },
        rm: function() {
            this.initialized = false;
            $(".playerWrapper").remove();
            window.chanel_player_playerContainer.destroy();
            $("#inline_popup").css("display", "none");
            $("#popin").removeClass("playerPopin").css("display", "none").html();
        }
    };
    _m_.init();
})(WFJ.module, jQuery);

/*
 * recherche
 */
(function(_super, $) {
    var _m_;
    _super.recherche = function recherche() {
        // INIT VARS
        var _this = this;
        var $pushRecherche = $("#pushRecherche");
        var $loader = $("#chargement");
        var $popin2 = $("#popin2");
        var $inline_popup2 = $("#inline_popup2");
        var $labels = $("label");
        var $resetRecherche = $("#resetRecherche");
        var $formRecherche = $("#formRecherche");
        var ajaxConnexion = null;
        var $inputs = $("input");
        var $sliderIpadConteneur = $("#sliderIpadConteneur");
        var $valeurLabel = $("#valeurLabel");
        var $scrollbar;
        var $backgroundSlide = $("#background-slide");
        var $filterPrice = $(".filter-price");
        var $checkboxPrice = $filterPrice.find("input");
        var money = "";
        var searchDisabled = true;
        var range, step, rangeDefault;
        var subsection_url = encodeURI($("#subsection_url").val());
        var saveValeur;
        // SET DEFAULT VALUES
        ajaxConnexion = $.ajax({
            type: "GET",
            url: "/" + sitelocEncoded + subsection_url + "-search_criteria/criteria",
            data: {
                maj: "searchcriteria"
            },
            success: function(result) {
                var response = result;
                var china;
                var orientation = isMobileTablet() ? "horizontal" : "vertical";
                range = [ parseInt(response["min"]), parseInt(response["max"]) ];
                rangeDefault = [ parseInt(response["min"]), parseInt(response["max"]) ];
                step = parseInt(response["step"]);
                china = range[0] != "" && range[1] != "" && step > 0 && ch_lang == "zh-cn";
                money = response["currency_symbol"];
                if (isNaN(range[0]) || isNaN(range[1]) || isNaN(step)) return;
                if (!china && ch_lang == "zh-cn") {
                    $sliderIpadConteneur.hide();
                    $valeurLabel.css("visibility", "hidden");
                } else {
                    $backgroundSlide.add($filterPrice).add($sliderIpadConteneur).show();
                    $valeurLabel.css("visibility", "visible");
                }
                $("#step").val(step);
                var sliderContainerSlide = function sliderContainerSlide(event, ui) {
                    var val1 = formatLocaleNumber(ui.values[0]);
                    var val2 = formatLocaleNumber(ui.values[1]);
                    var $valuesContainer = $sliderIpadConteneur.find("a");
                    if (locale == "en_GB" || locale == "en_US") {
                        $($valuesContainer[0]).html("<span class='handler1'>" + money + val1 + "</span>");
                        $($valuesContainer[1]).html("<span class='handler2'>" + money + val2 + "</span>");
                        $("#valeurs").val(ui.values[0] + "," + ui.values[1]);
                    } else {
                        $($valuesContainer[0]).html("<span class='handler1'>" + val1 + " " + money + "</span>");
                        $($valuesContainer[1]).html("<span class='handler2'>" + val2 + " " + money + "</span>");
                        $("#valeurs").val(ui.values[0] + "," + ui.values[1]);
                    }
                };
                var sliderContainerChange = function sliderContainerChange(event, ui) {
                    sliderContainerSlide(event, ui);
                    if (searchDisabled) return;
                    stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, $("#ch_scat1").val(), $("#ch_scat1").val() + " by price range criteria", $("#valeurs").val(), 50);
                    doAjaxSearch();
                };
                $scrollbar = $sliderIpadConteneur.slider({
                    orientation: orientation,
                    range: true,
                    min: range[0],
                    max: range[1],
                    values: range,
                    step: step,
                    slide: sliderContainerSlide,
                    change: sliderContainerChange
                });
                if ($scrollbar) {
                    $scrollbar.slider("values", range);
                    $scrollbar.slider({
                        disabled: true
                    });
                    $("#background-slide").addClass("disabled");
                    saveValeur = range.toString();
                    $("#valeurs").val("");
                }
                searchDisabled = false;
            },
            complete: function(result) {}
        });
        // LABALS CLICK CALLBACK
        var labelsClick = function labelsClick(e) {
            var $parent = $(this).parent();
            $parent.toggleClass("actives");
        };
        var inputClick = function inputClick(e) {
            var elmt = this;
            var $this = $(this);
            if (elmt.checked) {
                var tagdetailslabel = $this.attr("rel");
                stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, $("#ch_scat1").val(), $("#ch_scat1").val() + " by " + $this.attr("id").split("_")[0] + " criteria", tagdetailslabel, 50);
            }
            setTimeout(function() {
                doAjaxSearch();
            }, 300);
        };
        // DO AJAX PRODUCT SEARCH
        var doAjaxSearch = function doAjaxSearch() {
            $loader.addClass("light").show();
            if (ajaxConnexion != null) {
                ajaxConnexion.abort();
            }
            ajaxConnexion = $.ajax({
                type: "GET",
                url: "/" + sitelocEncoded + subsection_url + "-search_product/result?" + $formRecherche.serialize(),
                data: {},
                success: function(result) {
                    $("#recherche_result").html(result);
                },
                complete: function(result) {
                    $loader.hide().removeClass("light");
                    $resetRecherche.show();
                    _this.recherche_result();
                }
            });
        };
        // PUSH RECHERCHE CLICK CALLBACK
        var pushRechercheClick = function pushRechercheClick(e) {
            if ($(this).hasClass("no-ajax")) return;
            e.preventDefault();
            $loader.show();
            $.ajax({
                type: "GET",
                url: this.href + "?ajaxoutput=true",
                data: {},
                success: function(result) {
                    $popin2.html(result).addClass("widePopin");
                    $inline_popup2.show();
                    $loader.hide();
                },
                complete: function(result) {
                    $("#closePopin2Btn").bind("click", function(e) {
                        e.peventDefault();
                        $inline_popup2.hide();
                    });
                    WFJ.getDataController(false);
                }
            });
        };
        // RESET FORM CLICK CALLBACK
        var resetRechercheClick = function resetRechercheClick(e) {
            e.preventDefault();
            stats(ch_re, ch_lang, cg_n, cg_s, ch_div, ch_cat, $("#ch_scat1").val(), $("#ch_scat1").val() + " cancel selection", "", 50);
            $formRecherche[0].reset();
            $labels.parent().removeClass("actives");
            $("#valeurs").val("");
            if ($scrollbar) $scrollbar.slider("values", rangeDefault);
            $loader.addClass("light").show();
            if (ajaxConnexion != null) {
                ajaxConnexion.abort();
            }
            ajaxConnexion = $.ajax({
                type: "GET",
                url: "/" + sitelocEncoded + subsection_url + "-push/article",
                data: {},
                success: function(result) {
                    $("#recherche_result").html(result);
                },
                complete: function(result) {
                    $loader.hide().removeClass("light");
                    $resetRecherche.hide();
                    WFJ.getDataController(false);
                }
            });
        };
        //FORM CLICK PRICE 
        checkboxPriceClick = function checkboxPriceClick() {
            if ($checkboxPrice.attr("checked")) {
                $("#valeurs").val(saveValeur);
                $("#sliderIpadConteneur").slider({
                    disabled: false
                });
                $("#background-slide").removeClass("disabled");
            } else {
                saveValeur = $("#valeurs").val();
                $("#valeurs").val("");
                $("#sliderIpadConteneur").slider({
                    disabled: true
                });
                $("#background-slide").addClass("disabled");
            }
        };
        // SET EVENTS
        $resetRecherche.unbind("click", resetRechercheClick).bind("click", resetRechercheClick);
        $pushRecherche.unbind("click", pushRechercheClick).bind("click", pushRechercheClick);
        $labels.unbind("click", labelsClick).bind("click", labelsClick);
        $checkboxPrice.unbind("click", checkboxPriceClick).bind("click", checkboxPriceClick);
        $inputs.unbind("click", inputClick).bind("click", inputClick);
        return _this;
    };
    _m_ = _super.recherche;
    _m_.prototype.recherche_result = function() {
        // INIT VARS
        var _this = this;
        var $rechercheUl = $("#recherche_ul");
        var $rechercheLi = $rechercheUl.find("li");
        var $rechercheA = $rechercheUl.find("a");
        var $recherche_scrollbar = $(".scroll-recherche .scroll");
        var $inline_popup2 = $("#inline_popup2");
        var $popin2 = $("#popin2");
        var $loader = $("#chargement");
        // SET DEFAULT VALUES
        $rechercheUl.css({
            left: "0px",
            position: "absolute"
        });
        $rechercheLi.each(function(index, elmt) {
            $(this).css("left", index * elmt.offsetWidth + "px");
        });
        $recherche_scrollbar.chanelScroller({
            scrollContent: "#recherche_ul",
            margeLeft: 0,
            sliderControlLeft: "#galleryPrev2",
            sliderControlRight: "#galleryNext2",
            sliderControlAlwaysVisible: true
        });
        var swipeRecherche = function swipeRecherche(e) {
            if (e.direction == "left") {
                $("#galleryNext2").trigger("click");
            } else if (e.direction == "right") {
                $("#galleryPrev2").trigger("click");
            }
        };
        // SET EVENTS
        $rechercheUl.unbind("swipe", swipeRecherche).bind("swipe", {
            swipe_time: 500
        }, swipeRecherche);
    };
})(WFJ.module, jQuery);

/*
 * refs
 */
(function(_super, $) {
    var _m_;
    _super.refs = function() {
        // INIT VARS
        var _this = this;
        var $list_refs = $("#list_refs");
        // SET DEFAULT VALUES
        $list_refs.jScrollPane({
            autoReinitialise: true
        });
        return _this;
    };
    _m_ = _super.refs;
})(WFJ.module, jQuery);

/*
 * partager
 */
(function(_super, $) {
    var _m_;
    _super.share_product = function() {
        // INIT VARS
        var _this = this;
        var $partagerSubmit = $("#partagerSubmit");
        var $partagerForm = $("#partagerForm");
        $(".mask").show();
        // SET DEFAULT VALUES
        stats(ch_re, ch_lang, cg_n, "WFJ Share", ch_div, "WFJ Share", "Share page", "", "", 0);
        // PARTAGE SUBMIT FORM CALLBACK
        var partagerSubmitClick = function(e) {
            e.preventDefault();
            var level1 = $("#level1").val();
            if (checkForm($partagerForm[0])) {
                stats(ch_re, ch_lang, cg_n, "WFJ Share", ch_div, "WFJ Share", "Share Form Submit", "", "", 50);
                $.ajax({
                    type: "GET",
                    url: "/" + sitelocEncoded + "partager_send_mail?level1=" + level1 + "&" + $partagerForm.serialize(),
                    data: {},
                    success: function(result) {
                        stats(ch_re, ch_lang, cg_n, "WFJ Share", ch_div, "WFJ Share", "Share Thank you page", "", "", 0);
                        $("#partagerContent").html(result);
                        $("#partagerContent").addClass("success");
                        $("#partage_form_title").css("visibility", "hidden");
                        $("#partage_form_ref").css("visibility", "hidden");
                    },
                    complete: function(result) {
                        WFJ.getDataController(false);
                    }
                });
            }
        };
        // SET EVENTS
        $partagerSubmit.unbind("click", partagerSubmitClick).bind("click", partagerSubmitClick);
        return _this;
    };
    _m_ = _super.partager;
})(WFJ.module, jQuery);

/*
 * structure
 */
(function(_super, $) {
    var _m_;
    _super.structure = function() {
        var _this = this;
        /** GLOBAL **/
        $("#sliderControlLeft").bind("mouseover mouseout", function(e) {
            e.preventDefault();
        });
        $("#sliderControlRight").bind("mouseover mouseout", function(e) {
            e.preventDefault();
        });
        get_num_ecrin();
        return _this;
    };
    _m_ = _super.structure;
})(WFJ.module, jQuery);

/*
 * Whats new
 */
(function(_super, $) {
    var _m_;
    _super.whats_new = function() {
        var _this = this;
        $container = $("#mediaplayer-articles");
        if ($container.hasClass("list-type")) {
            _this.render();
        } else {
            var tpl = _.template($("#instantlisttpl").html());
            $container.html(tpl);
            _this.render();
        }
        $(".article .slideshow-visuel ul").show();
    };
    _super.whats_new.prototype.render = function() {
        // INIT VARS
        var _this = this;
        var $buttonRead = $(".description .read");
        var buttonReadH = $buttonRead.outerHeight();
        var $descriptionContent = $(".description-content");
        var $pagination = $(".pagination");
        var $closeDescription = $(".close-description");
        var $bulletSlideshow = $(" .pagination-visuel li");
        $(".article").show();
        $(".article .description").hide();
        $("#mediaplayer-articles").on("click", ".share li a", function(e) {
            e.preventDefault();
            var $b = $(e.target), $article = $b.parents(".article"), sn = $b.attr("class"), data, snUrl;
            data = {
                url: location.href,
                title: $article.data("share-title"),
                content: $article.data("share-content"),
                img: $article.data("share-img"),
                WT_sn_id: "",
                WT_sn_contentName: "",
                WT_sn_websiteName: "",
                WT_sn_sense: "2",
                locale: locale
            };
            if (sn === "twitter") {
                data.title = $article.data("share-twitter-content").substr(0, 250);
            }
            snUrl = sharing.setPostData(data, sn).share(true);
            console.log(snUrl);
            window.open(snUrl, "Sharing_API");
        });
        // SLIDESHOW
        $(".slideshow-visuel .slideshow-list ").slideshow({
            autoslide: false,
            interval: 4e3,
            // interval de l'autoslide
            shownav: true,
            //show the bullet-navigation
            navWrapper: null,
            //selector || DOM element
            preview: false,
            control: false,
            //show right and left arrow controls
            loop: true
        });
        var runSlideshow = function(directAccessSlide, newIndex, oldIndex, $slides) {
            var prefixe, pagination, bulletW, $article = $("#article_" + newIndex), $articleOld = oldIndex !== null ? $("#article_" + oldIndex) : null;
            if (directAccessSlide) {
                // start autoplay on current slide
                if ($article.find(".slideshow-list").length === 1) {
                    $article.find(".slideshow-list").data("slideshow").playSlide();
                }
            }
            // prefixe pagination number
            prefixe = prefixeSlideNumber(newIndex);
            pagination = prefixe + (newIndex + 1) + "/" + $slides.length;
            bulletW = $article.find(".bang-slideshow-nav-horizontal").innerWidth();
            $(".pagination span").html(pagination);
            if (!directAccessSlide) {
                // stop previous image slider
                if ($articleOld.find(".slideshow-list").length === 1) {
                    $articleOld.find(".slideshow-list").data("slideshow").stopSlide();
                }
                $articleOld.find(".discover-link").fadeOut(500);
                $articleOld.find(".description").fadeOut(500);
                $articleOld.find(".close-description").trigger("click");
            }
            // display new slide
            $article.find(".discover-link").fadeIn(1e3);
            $article.find(".description").fadeIn(1e3);
            $article.find(".bang-slideshow-nav-horizontal").css("marginLeft", -bulletW / 2);
            if (!directAccessSlide) {
                // start new image slider
                if ($article.find(".slideshow-list").length === 1) {
                    $article.find(".slideshow-list").data("slideshow").playSlide();
                }
                if (typeof history.pushState != "undefined") {
                    var idActive = $article.attr("data-id");
                    var datas = instantsList[idActive];
                    history.pushState({}, "", basehref + urlWhatnews + "/" + datas.url_segment);
                }
                // kill previous player
                if (WFJ.module.ooyala.player.initialized) {
                    WFJ.module.ooyala.player.destroy();
                }
            }
            if (directAccessSlide) {
                $(".big-description p").each(function(index) {
                    if ($(this).is(":empty")) {
                        $(this).closest(".description").find(".small-description .read").hide();
                    }
                });
            }
            // init video if exist
            if ($article.find(".playerContainer").length === 1) {
                $("#playerContainer").removeAttr("id");
                $("#chanel-oocontrols").removeAttr("id");
                $article.find(".playerContainer").attr("id", "playerContainer");
                $article.find(".chanel-oocontrols-player ").attr("id", "chanel-oocontrols");
                WFJ.module.ooyala.player.init({
                    context: "whats_new"
                });
            }
        };
        $("#mediaplayer-articles").slideshow({
            autoslide: false,
            easing: "swing",
            method: "animate",
            interval: 6e3,
            // interval de l'autoslide
            shownav: false,
            //show the bullet-navigation
            navWrapper: null,
            //selector || DOM element
            preview: true,
            control: true,
            //show right and left arrow controls
            controlWrapper: ".button-pagination",
            loop: false,
            callsync: function($slides, oldIndex, newIndex) {
                runSlideshow(false, newIndex, oldIndex, $slides);
            },
            callback: function() {
                setTimeout(function() {
                    sendWebtrends();
                }, 1e3);
            }
        }, function() {
            // Direct access to a slide (1st param: true)
            runSlideshow(true, this.activeIndex, null, this.$slides);
            sendWebtrends();
        });
        var expandDescription = function() {
            var $buttonPagination = $(".button-pagination a");
            var currentSlide = $(this).closest(".article.active");
            if (currentSlide.find(".big-description p").is(":empty")) {
                return;
            }
            currentSlide.find($descriptionContent).addClass("expand").animate({
                bottom: currentSlide.find(".big-description").height() - buttonReadH
            });
            $pagination.animate({
                right: "-" + parseInt($buttonPagination.width() + 20)
            });
            currentSlide.find($descriptionContent).find(".big-description p").animate({
                opacity: 1
            }, 750);
            $(".close-description").fadeIn(800);
            currentSlide.find($buttonRead).fadeOut(150);
        };
        var closeDescription = function() {
            var currentSlide = $(this).closest(".article.active");
            if ($(this).hasClass("external") || currentSlide.find(".big-description p").is(":empty")) {
                return;
            }
            var currentSlide = $(this).closest(".article.active");
            $pagination.animate({
                right: 0
            });
            currentSlide.find($descriptionContent).removeClass("expand").animate({
                bottom: 0
            });
            currentSlide.find($descriptionContent).find(".big-description p").animate({
                opacity: 0
            }, 750);
            $(".close-description").fadeOut(400);
            currentSlide.find($buttonRead).fadeIn(700);
            return false;
        };
        var onClickBulletSlideshow = function() {
            $bulletSlideshow.removeClass("active");
            $(this).addClass("active");
        };
        var keyHandler = function(event) {
            event.preventDefault();
            var currentSlide = $(this).find(".article.active");
            switch (event.keyCode) {
              case 37:
                $(".bang-slideshow-arrow-horizontal-tol").trigger("click");
                break;

              case 39:
                $(".bang-slideshow-arrow-horizontal-bor").trigger("click");
                break;

              case 38:
                currentSlide.find($buttonRead).trigger("click");
                break;

              case 40:
                currentSlide.find($closeDescription).trigger("click");
                break;
            }
        };
        function sendWebtrends() {
            var idActive = $(".article.active").attr("data-id");
            var datas = instantsList[idActive];
            stats(ch_re, ch_lang, cg_n, $("#cg_s").val(), ch_div, $("#ch_cat").val(), "Coulisses " + datas.ch_prod, "Coulisses " + datas.ch_prod + " synopsis", "", 0);
        }
        function goToSlide() {}
        $("#mediaplayer-articles").on("click", ".description .read", expandDescription);
        $("#mediaplayer-articles").on("click", ".close-description", closeDescription);
        $bulletSlideshow.on("click", onClickBulletSlideshow);
        $("body").on("keydown", keyHandler);
        return _this;
    };
    _m_ = _super.whatsnew;
})(WFJ.module, jQuery);