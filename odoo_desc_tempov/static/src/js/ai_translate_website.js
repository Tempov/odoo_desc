/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { AITranslateWebsiteDialog } from "./ai_translate_website_dialog";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";

const { Component, useState, useEffect } = owl;


export class AITranslateWebsiteSystray extends Component {
    setup() {
        this.websiteService = useService("website");
        this.dialogService = useService("dialog");
        this.uiService = useService("ui");
        this.orm = useService("orm");
        this.state = useState({
            hideTranslateBtn: false
        });
        this.websiteContext = useState(this.websiteService.context);

        const bindHideTranslateBtnFunc = this.hideTranslateBtnFunc.bind(this);
        useEffect(
            (el) => {
                if (el) {
                    this.hideTranslateBtnFunc();
                }
            },
            () => [window.location.href]
        );

    }

    hideTranslateBtnFunc() {
        this.state.hideTranslateBtn = this.websiteService.currentWebsite.metadata.viewXmlid.includes("website_sale");
    }

    onClickTranslate(el) {
        el.preventDefault();
        this.dialogService.add(AITranslateWebsiteDialog, {
            translate: this.aiTranslate.bind(this),
        });
    }

    async aiTranslate(
        website_id, page_id, translate_menu, translate_page,
        translate_footer, empty_only, languages, creativity_level, focus_level
    ) {
        this.uiService.block();
        try {
            await this.orm.call(
                "us.ai.website.translation",
                "translate_from_website",
                [
                    0, website_id, page_id, translate_menu,
                    translate_page, translate_footer, empty_only,
                    languages, creativity_level, focus_level
                ],
            );
            this.uiService.unblock();
            location.reload();
        } catch (e) {
            this.uiService.unblock();
            this.dialogService.add(AlertDialog, {
                title: _t("UserError"),
                body: _t(e.data.arguments[0]),
                size: "xl",
            });
        }

    }

}
AITranslateWebsiteSystray.template = "us_ai_translation.AITranslateWebsiteSystray";

export const systrayItem = {
    Component: AITranslateWebsiteSystray,
    isDisplayed: env => env.services.website.currentWebsite &&
        env.services.website.currentWebsite.metadata.translatable
};

registry.category("website_systray").add("AITranslateWebsiteSystray", systrayItem, { sequence: 9 });
