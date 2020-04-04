import { CustomPropertyEditor } from "nativescript-ui-dataform";

declare class EventRedirector {
    receiver: any;
    updateEditorValue(editorView, newValue);
    "handleTap:"(sender);
}
