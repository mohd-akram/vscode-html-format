import * as vscode from "vscode";
import format from "html-format";

class HTMLDocumentFormatter implements vscode.DocumentFormattingEditProvider {
  public provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions
  ): Thenable<vscode.TextEdit[]> {
    const { tabSize, insertSpaces } = options;

    const indent = insertSpaces ? " ".repeat(tabSize) : "\t";

    const { languageId: lang, uri } = document;
    const langConfig = vscode.workspace.getConfiguration(`[${lang}]`, uri);
    const config = vscode.workspace.getConfiguration("editor", uri);
    const width =
      langConfig["editor.wordWrapColumn"] || config.get("wordWrapColumn", 80);

    const text = document.getText();
    const range = new vscode.Range(
      document.positionAt(0),
      document.positionAt(text.length)
    );
    return Promise.resolve([
      new vscode.TextEdit(range, format(text, indent, width)),
    ]);
  }
}

export function activate(context: vscode.ExtensionContext) {
  const formatter = new HTMLDocumentFormatter();
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("html", formatter)
  );
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      "handlebars",
      formatter
    )
  );
}

export function deactivate() {}
