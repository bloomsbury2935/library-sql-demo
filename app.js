/* global alasql */
(function () {
  "use strict";

  var INITIAL_SQL =
    "SELECT [書籍名]\n" +
    "FROM [書籍マスタ]\n" +
    "WHERE [分類コード] = 910;";

  var TASK_B_SQL =
    "SELECT [?], [?]\n" +
    "FROM [書籍マスタ]\n" +/* global alasql */
(function () {
  "use strict";

  var INITIAL_SQL =
    "SELECT [書籍名]\n" +
    "FROM [書籍マスタ]\n" +
    "WHERE [分類コード] = 910;";

  var TASK_B_SQL =
    "SELECT [?], [?]\n" +
    "FROM [書籍マスタ]\n" +
    "WHERE [分類コード] = ?;";

  var JOIN_SQL =
    "SELECT b.[書籍名], a.[著者名], c.[分類名]\n" +
    "FROM [書籍マスタ] AS b\n" +
    "JOIN [著者マスタ] AS a\n" +
    "  ON b.[著者コード] = a.[著者コード]\n" +
    "JOIN [分類マスタ] AS c\n" +
    "  ON b.[分類コード] = c.[分類コード]\n" +
    "WHERE b.[分類コード] = 910;";

  /*
   * 書籍マスタ:
   * ISBN, 書籍名, 著者コード, 分類コード, 出版社, 発売日, C-CODE
   * ISBN・発売日・C-CODEは新潮社公式ページで照合済み。
   */
  var BOOK_ROWS = [
    ["978-4-10-101013-7", "こころ", "AU001", 910, "新潮社", "1952-03-04", "0193"],
    ["978-4-10-100605-5", "人間失格", "AU002", 910, "新潮社", "1952-11-03", "0193"],
    ["978-4-10-102501-8", "羅生門・鼻", "AU003", 910, "新潮社", "1968-07-23", "0193"],
    ["978-4-10-100244-6", "雪国", "AU004", 910, "新潮社", "2022-05-27", "0193"],
    ["978-4-10-100606-2", "走れメロス", "AU002", 910, "新潮社", "1954-04-07", "0193"],
    ["978-4-10-109205-8", "新編 銀河鉄道の夜", "AU005", 910, "新潮社", "1989-06-19", "0193"],
    ["978-4-10-101003-8", "坊っちゃん", "AU001", 910, "新潮社", "1950-02-02", "0193"],
    ["978-4-10-100602-4", "斜陽", "AU002", 910, "新潮社", "1950-11-22", "0193"],
    ["978-4-10-100503-4", "刺青・秘密", "AU006", 910, "新潮社", "1969-08-07", "0193"],
    ["978-4-10-107701-7", "李陵・山月記", "AU007", 910, "新潮社", "1969-09-23", "0193"],
    ["978-4-10-109601-8", "檸檬", "AU008", 910, "新潮社", "1967-12-12", "0193"],
    ["978-4-10-100608-6", "グッド・バイ", "AU002", 910, "新潮社", "1972-08-01", "0193"],
    ["978-4-10-207101-4", "変身", "AU009", 940, "新潮社", "1952-07-30", "0197"],
    ["978-4-10-200103-5", "車輪の下", "AU010", 940, "新潮社", "1951-12-04", "0197"],
    ["978-4-10-201501-8", "若きウェルテルの悩み", "AU011", 940, "新潮社", "1951-03-02", "0197"],
    ["978-4-10-201503-2", "ファウスト〔一〕", "AU011", 940, "新潮社", "1967-11-28", "0197"],
    ["978-4-10-200105-9", "クヌルプ", "AU010", 940, "新潮社", "1955-04-01", "0197"],
    ["978-4-10-200101-1", "春の嵐", "AU010", 940, "新潮社", "1950-12-06", "0197"],
    ["978-4-10-200102-8", "デミアン", "AU010", 940, "新潮社", "1951-12-04", "0197"],
    ["978-4-10-201504-9", "ファウスト〔二〕", "AU011", 940, "新潮社", "1968-02-27", "0197"]
  ];

  var AUTHOR_ROWS = [
    ["AU001", "夏目漱石"],
    ["AU002", "太宰治"],
    ["AU003", "芥川龍之介"],
    ["AU004", "川端康成"],
    ["AU005", "宮沢賢治"],
    ["AU006", "谷崎潤一郎"],
    ["AU007", "中島敦"],
    ["AU008", "梶井基次郎"],
    ["AU009", "フランツ・カフカ"],
    ["AU010", "ヘッセ"],
    ["AU011", "ゲーテ"]
  ];

  var CLASS_ROWS = [
    [910, "日本文学"],
    [940, "ドイツ文学"]
  ];

  /*
   * 蔵書マスタ:
   * 書籍コードには、新潮文庫の公式「整理番号」を使用。
   * 登録日は、この教材データベースへ20件を登録した日。
   */
  var HOLDING_ROWS = [
    ["な-1-13", "978-4-10-101013-7", "2026-07-13"],
    ["た-2-5", "978-4-10-100605-5", "2026-07-13"],
    ["あ-1-1", "978-4-10-102501-8", "2026-07-13"],
    ["か-1-1", "978-4-10-100244-6", "2026-07-13"],
    ["た-2-6", "978-4-10-100606-2", "2026-07-13"],
    ["み-2-5", "978-4-10-109205-8", "2026-07-13"],
    ["な-1-3", "978-4-10-101003-8", "2026-07-13"],
    ["た-2-2", "978-4-10-100602-4", "2026-07-13"],
    ["た-1-2", "978-4-10-100503-4", "2026-07-13"],
    ["な-5-1", "978-4-10-107701-7", "2026-07-13"],
    ["か-2-1", "978-4-10-109601-8", "2026-07-13"],
    ["た-2-8", "978-4-10-100608-6", "2026-07-13"],
    ["カ-1-1", "978-4-10-207101-4", "2026-07-13"],
    ["ヘ-1-3", "978-4-10-200103-5", "2026-07-13"],
    ["ケ-1-1", "978-4-10-201501-8", "2026-07-13"],
    ["ケ-1-3", "978-4-10-201503-2", "2026-07-13"],
    ["ヘ-1-5", "978-4-10-200105-9", "2026-07-13"],
    ["ヘ-1-1", "978-4-10-200101-1", "2026-07-13"],
    ["ヘ-1-2", "978-4-10-200102-8", "2026-07-13"],
    ["ケ-1-4", "978-4-10-201504-9", "2026-07-13"]
  ];

  var sqlInput;
  var runBtn;
  var resetBtn;
  var sampleBtn;
  var joinBtn;
  var message;
  var sourceTables;
  var resultTableWrap;
  var resultSummary;

  function byId(id) { return document.getElementById(id); }

  function setMessage(text, kind) {
    message.textContent = text || "";
    message.className = "message" + (kind ? " " + kind : "");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function normalizeSql(sql) {
    return String(sql || "")
      .replace(/\u3000/g, " ")
      .replace(/\r\n/g, "\n")
      .trim();
  }

  function hasSingleStatement(sql) {
    var parts = String(sql || "").split(";");
    var count = 0;
    var i;
    for (i = 0; i < parts.length; i += 1) {
      if (parts[i].replace(/\s/g, "") !== "") { count += 1; }
    }
    return count <= 1;
  }

  function validateSql(rawSql) {
    var sql = normalizeSql(rawSql);
    var clean;
    var statementMatch;
    var statementType;
    var tablePattern =
      "(?:書籍マスタ|著者マスタ|蔵書マスタ|分類マスタ)";
    var tableCheck;

    if (!sql) {
      return {
        ok: false,
        message: "SQLが空です。まずは初期SQLを実行しましょう。"
      };
    }

    if (!hasSingleStatement(sql)) {
      return {
        ok: false,
        message: "複数の文は実行できません。SQLは1文だけにしてください。"
      };
    }

    clean = sql.replace(/;\s*$/, "");

    statementMatch = /^(select|insert|update|delete)\b/i.exec(clean);

    if (!statementMatch) {
      return {
        ok: false,
        message:
          "この教材ではSELECT・INSERT・UPDATE・DELETEを実行できます。"
      };
    }

    statementType = statementMatch[1].toLowerCase();

    if (statementType === "select") {
      tableCheck = new RegExp(
        "\\bfrom\\s+(?:\\[" + tablePattern + "\\]|" +
        tablePattern + ")(?:\\s|$)",
        "i"
      );
    } else if (statementType === "insert") {
      tableCheck = new RegExp(
        "^insert\\s+into\\s+(?:\\[" + tablePattern + "\\]|" +
        tablePattern + ")(?:\\s|\\()",
        "i"
      );
    } else if (statementType === "update") {
      tableCheck = new RegExp(
        "^update\\s+(?:\\[" + tablePattern + "\\]|" +
        tablePattern + ")(?:\\s|$)",
        "i"
      );
    } else {
      tableCheck = new RegExp(
        "^delete\\s+from\\s+(?:\\[" + tablePattern + "\\]|" +
        tablePattern + ")(?:\\s|$)",
        "i"
      );
    }

    if (!tableCheck.test(clean)) {
      return {
        ok: false,
        message:
          "書籍マスタ・著者マスタ・蔵書マスタ・分類マスタの" +
          "いずれかを指定してください。"
      };
    }

    return {
      ok: true,
      sql: clean,
      type: statementType
    };
  }

  function createTable(name, columns) {
    alasql("DROP TABLE IF EXISTS [" + name + "]");
    alasql("CREATE TABLE [" + name + "] (" + columns + ")");
  }

  function insertRows(tableName, columnNames, rows) {
    var placeholders = columnNames.map(function () { return "?"; }).join(", ");
    var columns = columnNames.map(function (name) { return "[" + name + "]"; }).join(", ");
    var sql = "INSERT INTO [" + tableName + "] (" + columns + ") VALUES (" + placeholders + ")";
    var i;
    for (i = 0; i < rows.length; i += 1) {
      alasql(sql, rows[i]);
    }
  }

  function buildDatabase() {
    createTable(
      "書籍マスタ",
      "[ISBN] STRING, [書籍名] STRING, [著者コード] STRING, [分類コード] INT, " +
      "[出版社] STRING, [発売日] STRING, [C-CODE] STRING"
    );
    createTable("著者マスタ", "[著者コード] STRING, [著者名] STRING");
    createTable("分類マスタ", "[分類コード] INT, [分類名] STRING");
    createTable("蔵書マスタ", "[書籍コード] STRING, [ISBN] STRING, [登録日] STRING");

    insertRows(
      "書籍マスタ",
      ["ISBN", "書籍名", "著者コード", "分類コード", "出版社", "発売日", "C-CODE"],
      BOOK_ROWS
    );
    insertRows("著者マスタ", ["著者コード", "著者名"], AUTHOR_ROWS);
    insertRows("分類マスタ", ["分類コード", "分類名"], CLASS_ROWS);
    insertRows("蔵書マスタ", ["書籍コード", "ISBN", "登録日"], HOLDING_ROWS);
  }

  function tableHtml(captionText, rows) {
    var html = "";
    var keys;
    var i;
    var j;

    if (!rows || rows.length === 0) {
      return "<p class=\"help\">該当するデータはありません。</p>";
    }

    keys = Object.keys(rows[0]);
    html += "<div class=\"tableWrap\"><table>";
    html += "<caption>" + escapeHtml(captionText) + "</caption>";
    html += "<thead><tr>";
    for (i = 0; i < keys.length; i += 1) {
      html += "<th scope=\"col\">" + escapeHtml(keys[i]) + "</th>";
    }
    html += "</tr></thead><tbody>";
    for (i = 0; i < rows.length; i += 1) {
      html += "<tr>";
      for (j = 0; j < keys.length; j += 1) {
        html += "<td>" + escapeHtml(rows[i][keys[j]]) + "</td>";
      }
      html += "</tr>";
    }
    html += "</tbody></table></div>";
    return html;
  }

  function renderTable(container, captionText, rows) {
    container.innerHTML = tableHtml(captionText, rows);
  }

  function sourceBlock(title, note, rows) {
    return (
      "<section class=\"sourceBlock\">" +
      "<h3>" + escapeHtml(title) + "</h3>" +
      (note ? "<p class=\"help\">" + escapeHtml(note) + "</p>" : "") +
      tableHtml(title, rows) +
      "</section>"
    );
  }

  function renderSourceTables() {
    var holdingRows = alasql("SELECT * FROM [蔵書マスタ]");
    var bookRows = alasql("SELECT * FROM [書籍マスタ]");
    var authorRows = alasql("SELECT * FROM [著者マスタ]");
    var classRows = alasql("SELECT * FROM [分類マスタ]");

    sourceTables.innerHTML =
      sourceBlock("蔵書マスタ", "1冊ごとの管理情報。書籍コードは新潮文庫の整理番号。", holdingRows) +
      sourceBlock("書籍マスタ", "本そのものの書誌情報。n = 20。", bookRows) +
      sourceBlock("著者マスタ", "著者名を重複して書かないための表。", authorRows) +
      sourceBlock("分類マスタ", "分類コードと分類名を対応させる表。", classRows);
  }

  function explainError(err) {
    var text = String(err && err.message ? err.message : err);
    if (/Parse error/i.test(text)) {
      return "SQLの書き方を確認してください。命令の順序、表名、列名、括弧、引用符を見直しましょう。";
    }
    if (/column|Cannot read properties/i.test(text)) {
      return "列名を確認してください。右側の4つの元データ表から、使える列名を確認できます。";
    }
    if (/table/i.test(text)) {
      return "表名を確認してください。4つのマスタ名を正確に入力してください。";
    }
    return "実行できませんでした。つづり・空白・記号を確認してください。";
  }

  function runCurrentSql() {
    var validation = validateSql(sqlInput.value);
    var result;
    var affectedRows;

    if (!validation.ok) {
      setMessage(validation.message, "error");
      resultSummary.textContent = "実行されていません。";
      resultTableWrap.innerHTML = "";
      return;
    }

    try {
      result = alasql(validation.sql);

      if (validation.type === "select") {
        renderTable(resultTableWrap, "検索結果", result);
        resultSummary.textContent =
          result.length + "件のデータが見つかりました。";
        setMessage("SQLを実行しました。", "success");
      } else {
        renderSourceTables();

        affectedRows =
          typeof result === "number" ? result : null;

        if (affectedRows === null) {
          resultSummary.textContent = "データを変更しました。";
        } else {
          resultSummary.textContent =
            affectedRows + "件のデータを変更しました。";
        }

        resultTableWrap.innerHTML = "";

        setMessage(
          "SQLを実行し、元データを更新しました。" +
          "ページを再読み込みすると初期状態に戻ります。",
          "success"
        );
      }

      resultSummary.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    } catch (err) {
      resultSummary.textContent = "エラーが発生しました。";
      resultTableWrap.innerHTML = "";
      setMessage(explainError(err), "error");
    }
  }

  function resetSql() {
    sqlInput.value = INITIAL_SQL;
    setMessage("初期SQLに戻しました。", "success");
  }

  function setSampleSql() {
    sqlInput.value = TASK_B_SQL;
    setMessage("「?」を適切なフィールド名と分類コードに置き換えましょう。", "success");
  }

  function setJoinSql() {
    sqlInput.value = JOIN_SQL;
    setMessage("書籍・著者・分類の3表を結合する例を入れました。", "success");
  }

  function bindEvents() {
    runBtn.addEventListener("click", runCurrentSql);
    resetBtn.addEventListener("click", resetSql);
    sampleBtn.addEventListener("click", setSampleSql);
    joinBtn.addEventListener("click", setJoinSql);
    sqlInput.addEventListener("keydown", function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        runCurrentSql();
      }
    });
  }

  function init() {
    if (typeof alasql === "undefined") {
      document.body.innerHTML =
        "<main class=\"page\"><section class=\"card\"><h1>AlaSQLを読み込めませんでした</h1>" +
        "<p>インターネット接続、またはCDNの読み込みを確認してください。</p></section></main>";
      return;
    }

    sqlInput = byId("sqlInput");
    runBtn = byId("runBtn");
    resetBtn = byId("resetBtn");
    sampleBtn = byId("sampleBtn");
    joinBtn = byId("joinBtn");
    message = byId("message");
    sourceTables = byId("sourceTables");
    resultTableWrap = byId("resultTableWrap");
    resultSummary = byId("resultSummary");

    buildDatabase();
    renderSourceTables();
    sqlInput.value = INITIAL_SQL;
    bindEvents();
    setMessage("準備できました。まずは初期SQLをそのまま実行しましょう。", "success");
  }

  window.addEventListener("DOMContentLoaded", init);
}());

    "WHERE [分類コード] = ?;";

  var JOIN_SQL =
    "SELECT b.[書籍名], a.[著者名], c.[分類名]\n" +
    "FROM [書籍マスタ] AS b\n" +
    "JOIN [著者マスタ] AS a\n" +
    "  ON b.[著者コード] = a.[著者コード]\n" +
    "JOIN [分類マスタ] AS c\n" +
    "  ON b.[分類コード] = c.[分類コード]\n" +
    "WHERE b.[分類コード] = 910;";

  /*
   * 書籍マスタ:
   * ISBN, 書籍名, 著者コード, 分類コード, 出版社, 発売日, C-CODE
   * ISBN・発売日・C-CODEは新潮社公式ページで照合済み。
   */
  var BOOK_ROWS = [
    ["978-4-10-101013-7", "こころ", "AU001", 910, "新潮社", "1952-03-04", "0193"],
    ["978-4-10-100605-5", "人間失格", "AU002", 910, "新潮社", "1952-11-03", "0193"],
    ["978-4-10-102501-8", "羅生門・鼻", "AU003", 910, "新潮社", "1968-07-23", "0193"],
    ["978-4-10-100244-6", "雪国", "AU004", 910, "新潮社", "2022-05-27", "0193"],
    ["978-4-10-100606-2", "走れメロス", "AU002", 910, "新潮社", "1954-04-07", "0193"],
    ["978-4-10-109205-8", "新編 銀河鉄道の夜", "AU005", 910, "新潮社", "1989-06-19", "0193"],
    ["978-4-10-101003-8", "坊っちゃん", "AU001", 910, "新潮社", "1950-02-02", "0193"],
    ["978-4-10-100602-4", "斜陽", "AU002", 910, "新潮社", "1950-11-22", "0193"],
    ["978-4-10-100503-4", "刺青・秘密", "AU006", 910, "新潮社", "1969-08-07", "0193"],
    ["978-4-10-107701-7", "李陵・山月記", "AU007", 910, "新潮社", "1969-09-23", "0193"],
    ["978-4-10-109601-8", "檸檬", "AU008", 910, "新潮社", "1967-12-12", "0193"],
    ["978-4-10-100608-6", "グッド・バイ", "AU002", 910, "新潮社", "1972-08-01", "0193"],
    ["978-4-10-207101-4", "変身", "AU009", 940, "新潮社", "1952-07-30", "0197"],
    ["978-4-10-200103-5", "車輪の下", "AU010", 940, "新潮社", "1951-12-04", "0197"],
    ["978-4-10-201501-8", "若きウェルテルの悩み", "AU011", 940, "新潮社", "1951-03-02", "0197"],
    ["978-4-10-201503-2", "ファウスト〔一〕", "AU011", 940, "新潮社", "1967-11-28", "0197"],
    ["978-4-10-200105-9", "クヌルプ", "AU010", 940, "新潮社", "1955-04-01", "0197"],
    ["978-4-10-200101-1", "春の嵐", "AU010", 940, "新潮社", "1950-12-06", "0197"],
    ["978-4-10-200102-8", "デミアン", "AU010", 940, "新潮社", "1951-12-04", "0197"],
    ["978-4-10-201504-9", "ファウスト〔二〕", "AU011", 940, "新潮社", "1968-02-27", "0197"]
  ];

  var AUTHOR_ROWS = [
    ["AU001", "夏目漱石"],
    ["AU002", "太宰治"],
    ["AU003", "芥川龍之介"],
    ["AU004", "川端康成"],
    ["AU005", "宮沢賢治"],
    ["AU006", "谷崎潤一郎"],
    ["AU007", "中島敦"],
    ["AU008", "梶井基次郎"],
    ["AU009", "フランツ・カフカ"],
    ["AU010", "ヘッセ"],
    ["AU011", "ゲーテ"]
  ];

  var CLASS_ROWS = [
    [910, "日本文学"],
    [940, "ドイツ文学"]
  ];

  /*
   * 蔵書マスタ:
   * 書籍コードには、新潮文庫の公式「整理番号」を使用。
   * 登録日は、この教材データベースへ20件を登録した日。
   */
  var HOLDING_ROWS = [
    ["な-1-13", "978-4-10-101013-7", "2026-07-13"],
    ["た-2-5", "978-4-10-100605-5", "2026-07-13"],
    ["あ-1-1", "978-4-10-102501-8", "2026-07-13"],
    ["か-1-1", "978-4-10-100244-6", "2026-07-13"],
    ["た-2-6", "978-4-10-100606-2", "2026-07-13"],
    ["み-2-5", "978-4-10-109205-8", "2026-07-13"],
    ["な-1-3", "978-4-10-101003-8", "2026-07-13"],
    ["た-2-2", "978-4-10-100602-4", "2026-07-13"],
    ["た-1-2", "978-4-10-100503-4", "2026-07-13"],
    ["な-5-1", "978-4-10-107701-7", "2026-07-13"],
    ["か-2-1", "978-4-10-109601-8", "2026-07-13"],
    ["た-2-8", "978-4-10-100608-6", "2026-07-13"],
    ["カ-1-1", "978-4-10-207101-4", "2026-07-13"],
    ["ヘ-1-3", "978-4-10-200103-5", "2026-07-13"],
    ["ケ-1-1", "978-4-10-201501-8", "2026-07-13"],
    ["ケ-1-3", "978-4-10-201503-2", "2026-07-13"],
    ["ヘ-1-5", "978-4-10-200105-9", "2026-07-13"],
    ["ヘ-1-1", "978-4-10-200101-1", "2026-07-13"],
    ["ヘ-1-2", "978-4-10-200102-8", "2026-07-13"],
    ["ケ-1-4", "978-4-10-201504-9", "2026-07-13"]
  ];

  var sqlInput;
  var runBtn;
  var resetBtn;
  var sampleBtn;
  var joinBtn;
  var message;
  var sourceTables;
  var resultTableWrap;
  var resultSummary;

  function byId(id) { return document.getElementById(id); }

  function setMessage(text, kind) {
    message.textContent = text || "";
    message.className = "message" + (kind ? " " + kind : "");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function normalizeSql(sql) {
    return String(sql || "")
      .replace(/\u3000/g, " ")
      .replace(/\r\n/g, "\n")
      .trim();
  }

  function hasSingleStatement(sql) {
    var parts = String(sql || "").split(";");
    var count = 0;
    var i;
    for (i = 0; i < parts.length; i += 1) {
      if (parts[i].replace(/\s/g, "") !== "") { count += 1; }
    }
    return count <= 1;
  }

  function validateSql(rawSql) {
    var sql = normalizeSql(rawSql);
    var clean;
    var forbidden;

    if (!sql) {
      return { ok: false, message: "SQL が空です。まずは初期SQLを実行しましょう。" };
    }
    if (!hasSingleStatement(sql)) {
      return { ok: false, message: "複数の文は実行できません。1つの SELECT 文だけにしてください。" };
    }

    clean = sql.replace(/;\s*$/, "");

    if (!/^select\b/i.test(clean)) {
      return { ok: false, message: "この教材では SELECT 文のみ実行できます。" };
    }

    forbidden = /\b(insert|update|delete|drop|create|alter|attach|detach|use|source|require|merge|replace|truncate|exec|run|declare|set)\b/i;
    if (forbidden.test(clean)) {
      return { ok: false, message: "データを書き換える文は無効です。SELECT 文だけを使ってください。" };
    }

    if (!/from\s+(?:\[(?:書籍|著者|蔵書|分類)マスタ\]|(?:書籍|著者|蔵書|分類)マスタ)(?:\s|$)/i.test(clean)) {
      return {
        ok: false,
        message: "FROM には [書籍マスタ]・[著者マスタ]・[蔵書マスタ]・[分類マスタ] のいずれかを指定してください。"
      };
    }

    return { ok: true, sql: clean };
  }

  function createTable(name, columns) {
    alasql("DROP TABLE IF EXISTS [" + name + "]");
    alasql("CREATE TABLE [" + name + "] (" + columns + ")");
  }

  function insertRows(tableName, columnNames, rows) {
    var placeholders = columnNames.map(function () { return "?"; }).join(", ");
    var columns = columnNames.map(function (name) { return "[" + name + "]"; }).join(", ");
    var sql = "INSERT INTO [" + tableName + "] (" + columns + ") VALUES (" + placeholders + ")";
    var i;
    for (i = 0; i < rows.length; i += 1) {
      alasql(sql, rows[i]);
    }
  }

  function buildDatabase() {
    createTable(
      "書籍マスタ",
      "[ISBN] STRING, [書籍名] STRING, [著者コード] STRING, [分類コード] INT, " +
      "[出版社] STRING, [発売日] STRING, [C-CODE] STRING"
    );
    createTable("著者マスタ", "[著者コード] STRING, [著者名] STRING");
    createTable("分類マスタ", "[分類コード] INT, [分類名] STRING");
    createTable("蔵書マスタ", "[書籍コード] STRING, [ISBN] STRING, [登録日] STRING");

    insertRows(
      "書籍マスタ",
      ["ISBN", "書籍名", "著者コード", "分類コード", "出版社", "発売日", "C-CODE"],
      BOOK_ROWS
    );
    insertRows("著者マスタ", ["著者コード", "著者名"], AUTHOR_ROWS);
    insertRows("分類マスタ", ["分類コード", "分類名"], CLASS_ROWS);
    insertRows("蔵書マスタ", ["書籍コード", "ISBN", "登録日"], HOLDING_ROWS);
  }

  function tableHtml(captionText, rows) {
    var html = "";
    var keys;
    var i;
    var j;

    if (!rows || rows.length === 0) {
      return "<p class=\"help\">該当するデータはありません。</p>";
    }

    keys = Object.keys(rows[0]);
    html += "<div class=\"tableWrap\"><table>";
    html += "<caption>" + escapeHtml(captionText) + "</caption>";
    html += "<thead><tr>";
    for (i = 0; i < keys.length; i += 1) {
      html += "<th scope=\"col\">" + escapeHtml(keys[i]) + "</th>";
    }
    html += "</tr></thead><tbody>";
    for (i = 0; i < rows.length; i += 1) {
      html += "<tr>";
      for (j = 0; j < keys.length; j += 1) {
        html += "<td>" + escapeHtml(rows[i][keys[j]]) + "</td>";
      }
      html += "</tr>";
    }
    html += "</tbody></table></div>";
    return html;
  }

  function renderTable(container, captionText, rows) {
    container.innerHTML = tableHtml(captionText, rows);
  }

  function sourceBlock(title, note, rows) {
    return (
      "<section class=\"sourceBlock\">" +
      "<h3>" + escapeHtml(title) + "</h3>" +
      (note ? "<p class=\"help\">" + escapeHtml(note) + "</p>" : "") +
      tableHtml(title, rows) +
      "</section>"
    );
  }

  function renderSourceTables() {
    var holdingRows = alasql("SELECT * FROM [蔵書マスタ]");
    var bookRows = alasql("SELECT * FROM [書籍マスタ]");
    var authorRows = alasql("SELECT * FROM [著者マスタ]");
    var classRows = alasql("SELECT * FROM [分類マスタ]");

    sourceTables.innerHTML =
      sourceBlock("蔵書マスタ", "1冊ごとの管理情報。書籍コードは新潮文庫の整理番号。", holdingRows) +
      sourceBlock("書籍マスタ", "本そのものの書誌情報。n = 20。", bookRows) +
      sourceBlock("著者マスタ", "著者名を重複して書かないための表。", authorRows) +
      sourceBlock("分類マスタ", "分類コードと分類名を対応させる表。", classRows);
  }

  function explainError(err) {
    var text = String(err && err.message ? err.message : err);
    if (/Parse error/i.test(text)) {
      return "SQL の書き方を確認してください。SELECT → FROM → WHERE の順や、角括弧を見直しましょう。";
    }
    if (/column|Cannot read properties/i.test(text)) {
      return "列名を確認してください。右側の4つの元データ表から、使える列名を確認できます。";
    }
    if (/table/i.test(text)) {
      return "表名を確認してください。4つのマスタ名を正確に入力してください。";
    }
    return "実行できませんでした。つづり・空白・記号を確認してください。";
  }

  function runCurrentSql() {
    var validation = validateSql(sqlInput.value);
    var rows;

    if (!validation.ok) {
      setMessage(validation.message, "error");
      resultSummary.textContent = "実行されていません。";
      resultTableWrap.innerHTML = "";
      return;
    }

    try {
      rows = alasql(validation.sql);
      renderTable(resultTableWrap, "検索結果", rows);
      resultSummary.textContent = rows.length + " 件のデータが見つかりました。";
      setMessage("SQL を実行しました。", "success");
      resultSummary.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (err) {
      resultSummary.textContent = "エラーが発生しました。";
      resultTableWrap.innerHTML = "";
      setMessage(explainError(err), "error");
    }
  }

  function resetSql() {
    sqlInput.value = INITIAL_SQL;
    setMessage("初期SQLに戻しました。", "success");
  }

  function setSampleSql() {
    sqlInput.value = TASK_B_SQL;
    setMessage("「?」を適切なフィールド名と分類コードに置き換えましょう。", "success");
  }

  function setJoinSql() {
    sqlInput.value = JOIN_SQL;
    setMessage("書籍・著者・分類の3表を結合する例を入れました。", "success");
  }

  function bindEvents() {
    runBtn.addEventListener("click", runCurrentSql);
    resetBtn.addEventListener("click", resetSql);
    sampleBtn.addEventListener("click", setSampleSql);
    joinBtn.addEventListener("click", setJoinSql);
    sqlInput.addEventListener("keydown", function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        runCurrentSql();
      }
    });
  }

  function init() {
    if (typeof alasql === "undefined") {
      document.body.innerHTML =
        "<main class=\"page\"><section class=\"card\"><h1>AlaSQLを読み込めませんでした</h1>" +
        "<p>インターネット接続、またはCDNの読み込みを確認してください。</p></section></main>";
      return;
    }

    sqlInput = byId("sqlInput");
    runBtn = byId("runBtn");
    resetBtn = byId("resetBtn");
    sampleBtn = byId("sampleBtn");
    joinBtn = byId("joinBtn");
    message = byId("message");
    sourceTables = byId("sourceTables");
    resultTableWrap = byId("resultTableWrap");
    resultSummary = byId("resultSummary");

    buildDatabase();
    renderSourceTables();
    sqlInput.value = INITIAL_SQL;
    bindEvents();
    setMessage("準備できました。まずは初期SQLをそのまま実行しましょう。", "success");
  }

  window.addEventListener("DOMContentLoaded", init);
}());
