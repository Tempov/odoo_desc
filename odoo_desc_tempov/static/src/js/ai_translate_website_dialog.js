/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { Dialog } from "@web/core/dialog/dialog";
import { CheckBox } from "@web/core/checkbox/checkbox";
import { useService } from "@web/core/utils/hooks";
import { Dropdown } from "@web/core/dropdown/dropdown";
import { DropdownItem } from "@web/core/dropdown/dropdown_item";


const { Component, onWillStart, useState } = owl;


export class AITranslateWebsiteDialog extends Component {
    setup() {
        this.orm = useService("orm");
        this.websiteService = useService("website");
        this.notification = useService("notification");

        this.translateMenu = false;
        this.translatePage = true;
        this.translateFooter = false;
        this.onlyUntranslatedText = true;

        this.state = useState({
            languages: [],
            creativity_level: 0.5,
            focus_level: 1.0,
        })
        this.websiteLanguages = [];

        onWillStart(async () => {
            const website = await this.orm.searchRead(
                "website",
                [["id", "=", this.websiteService.currentWebsite.id]],
                ["language_ids"]
            );
            const websiteLanguageIds = website[0].language_ids;

            this.websiteLanguages = await this.orm.searchRead(
                "res.lang",
                [["id", "in", websiteLanguageIds]],
                ["name", "code"]
            );
        });
    }

    setLanguage(newValue, lang) {
        if (newValue && !this.state.languages.includes(lang)) {
            this.state.languages.push(lang);
        } else {
            this.state.languages = this.state.languages.filter((l) => l !== lang);
        }

    }

    setTranslateMenu(newValue) {
        this.translateMenu = newValue;
    }

    setTranslatePage(newValue) {
        this.translatePage = newValue;
    }

    setTranslateFooter(newValue) {
        this.translateFooter = newValue;
    }

    setOnlyUntranslatedText(newValue) {
        this.onlyUntranslatedText = newValue;
    }

    translate() {
        if (!this.translateMenu && !this.translatePage && !this.translateFooter) {
            this.notification.add(
                _t("Select what you want to translate!"),
                {type: "warning"}
            );
            return;
        }
        if (!this.state.languages.length) {
            this.notification.add(
                _t("Select a language!"),
                {type: "warning"}
            );
            return;
        }
        const website_id = this.websiteService.currentWebsite.id;
        const page_id = this.websiteService.currentWebsite.metadata.mainObject.id;
        this.props.translate(
            website_id, page_id,
            this.translateMenu, this.translatePage, this.translateFooter,
            this.onlyUntranslatedText, this.state.languages,
            this.state.creativity_level, this.state.focus_level
        );
    }

    close() {
        this.props.close();
    }

}

AITranslateWebsiteDialog.template = "us_ai_translation.AITranslateWebsiteDialog";
AITranslateWebsiteDialog.components = { Dialog, CheckBox, Dropdown, DropdownItem };
AITranslateWebsiteDialog.props = {
    translate: Function,
    close: Function,
};
