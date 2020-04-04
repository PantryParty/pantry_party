import { android as androidApplication  } from "tns-core-modules/application";
import { CustomPropertyEditor } from "nativescript-ui-dataform";
import { EventRedirector } from "../utilities/buttonHelper";
import { isNSDictionary } from "../utilities/isNSDictionary";

export class NamedThingSelectorButton<T extends {name: string}> {
  private selectedValue: NSDictionary<string, string> | T | null;
  private editor: CustomPropertyEditor;
  private redirector: EventRedirector;

  constructor(public nounName: string, private valueGetter: () => Promise<T>) {
  }

  get value() {
    return this.selectedValue;
  }

  editorNeedsView(args) {
    if (androidApplication) {
      this.editor = args.object;
      const androidEditorView: android.widget.Button = new android.widget.Button(args.context);
      androidEditorView.setOnClickListener(new android.view.View.OnClickListener({
        onClick: (view: android.view.View) => {
          this.handleTap(view, args.object);
        }
      }));
      args.view = androidEditorView;
      this.updateButtonText(androidEditorView);
    } else {

      this.redirector = new EventRedirector();
      this.redirector.receiver = this;

      this.editor = args.object;
      const iosEditorView = UIButton.buttonWithType(UIButtonType.System);
      iosEditorView.contentHorizontalAlignment = UIControlContentHorizontalAlignment.Left;
      iosEditorView.addTargetActionForControlEvents(
        this.redirector,
        "handleTap:",
        UIControlEvents.TouchUpInside
      );
      args.view = iosEditorView;

      this.updateButtonText(iosEditorView);
    }
  }

  editorHasToApplyValue(args) {
    this.updateEditorValue(args.view, args.value);
  }

  editorNeedsValue(args) {
    args.value = this.selectedValue;
  }

  updateEditorValue(editorView, value?: T | string) {
    if (typeof value === "string") {
      this.selectedValue = JSON.parse(value);
    } else {
      this.selectedValue = value;
    }
    this.updateButtonText(editorView);
  }

  updateButtonText(view) {
    if (androidApplication) {
      view.setText(this.buttonText());
    } else {
      view.setTitleForState(
        this.buttonText(),
        UIControlState.Normal
      );
    }
  }

  buttonText() {
    if (isNSDictionary(this.selectedValue)) {
      return this.selectedValue.objectForKey("name");
    } else if (this.selectedValue) {
      return this.selectedValue.name;
    }

    return `No ${this.nounName} Selected`;
  }

  handleTap(editorView, editor) {
    this.valueGetter().then((r) => {
      this.updateEditorValue(editorView, r);
      editor.notifyValueChanged();
      this.editor.notifyValueChanged();
    });
  }

  iosHandleTap(sender) {
    this.valueGetter().then((r) => {
      this.updateEditorValue(sender, r);
      this.editor.notifyValueChanged();
    });
  }
}
