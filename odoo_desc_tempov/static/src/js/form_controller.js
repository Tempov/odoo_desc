/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { FormController } from "@web/views/form/form_controller";
import { ControlPanel } from "@web/search/control_panel/control_panel";
import { formView } from "@web/views/form/form_view";


export class AiTranslationControlPanel extends ControlPanel {
    setup() {
        super.setup();
        const jsId = this.breadcrumbs.slice(-1)[0].jsId;
        this.breadcrumbs.pop();
        this.breadcrumbs.push({jsId:jsId, name: _t("AI Translation")});
    }
};


export class AiTranslationLayout extends Layout {
    setup() {
        super.setup();
        this.components.ControlPanel = AiTranslationControlPanel;
    }
};


export class AiTranslationFormController extends FormController {};
AiTranslationFormController.components = {
    ...FormController.components,
    Layout: AiTranslationLayout,
}
AiTranslationFormController.template = "us_ai_translation.AiTranslationFormView";


export const aiTranslationFormView = {
    ...formView,
    Controller: AiTranslationFormController,
};

registry.category("views").add("ai_translation_form", aiTranslationFormView);