/** @odoo-module */

import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { Wysiwyg } from "@web_editor/js/wysiwyg/wysiwyg";
import { useService } from "@web/core/utils/hooks";
import { _t } from "@web/core/l10n/translation";
import { patch } from "@web/core/utils/patch";


patch(Wysiwyg.prototype, {
    setup() {
        super.setup();
        this.dialogService = useService("dialog");
    },

    _configureToolbar(options) {
        super._configureToolbar(...arguments);
        const $toolbar = $(this.toolbarEl);
        const $translateBtn = $toolbar.find("#ai_translate_text");
        if (!options.enableTranslation) {
            $translateBtn.hide();
            return;
        }
        $translateBtn.click((el) => this._ai_translate(el, options));
    },

    async _ai_translate(el, options) {
        el.preventDefault();
        el.stopImmediatePropagation();
        el.stopPropagation();
        el.target.blur();
        const sel = options.document.getSelection();
        const sel_text = sel.toString();
        if (!sel_text || !sel.rangeCount > 0) {
            this.dialogService.add(AlertDialog, {
                title: _t("Translation"),
                body: _t("You haven't selected the text you want to translate!"),
            });
            return;
        }

        await this.rpc("/ai_translate_text", {
            text: sel_text,
            lang: options.context.lang,
        }).then(translation => {
            if (translation) {
                const range = sel.getRangeAt(0);
                range.deleteContents();
                const newNode = document.createTextNode(translation.translation);
                range.insertNode(newNode);
                sel.removeAllRanges();
            }
        });

    },
});
