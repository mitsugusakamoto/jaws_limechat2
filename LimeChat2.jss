; JAWS Script for LimeChat2 (2.39 and higher)
; Copyright (c) 2009 Koichi Inoue

; LimeChat 2.30上で動作を確認しています。
;
; JAWSでLimeChat2を利用する場合、以下の設定をしておくと使いやすくなります。
; ・「設定」画面で
;   - 「トレイアイコン」で、「最小化したときに、メインウインドーをタスクバーに表示しない」をオン。ALT+Tabの選択に現れなくなります。タスクトレイからアクセスできます。
;   - 「ウインドー」の「ホットキーでアクティブにする」をオン。適当なホットキーを割り当てます。
; ・メインウインドーから「設定」→「最前面に表示」のチェックを外します。これがチェックされていると他のウインドーの読み上げを妨げることがあります。
;
; このスクリプトで変更される動作は以下の通りです。
;   - 入力フィールドでTab, Shift+Tabを押した時、フィールドが空だったらそれぞれ全体ログ・チャネルログに移動します。本来は設定のインターフェースタブでニックネーム補完を無効にする必要がありました。

; ■技術情報
; LimeChat2のウインドーは大きく二つのウインドー(コントロールIDがCID_SUBWINDOW1, CID_SUBWINDOW2)から構成されています。
; CID_SUBWINDOW1にはチャネルログ、全体ログ、入力フィールドがあります。
; CID_SUBWINDOW2にはユーザリストとサーバツリーがあります。
; チャネルログとユーザリストは入っているチャネル分が存在していて、選択されているチャネルのものが見えるようになっています。移動系のスクリプトではこの構造を利用して目的のコントロールを見つけ、フォーカスを当てるようになっています。
; チャネルログに移動した時にはアクティブなチャネル名を読み上げますが、このチャネル名はサーバツリーで強調表示されている箇所から取得しています。また、CTRL+上下矢印などでチャネルを切り替えた時の読み上げも同様に強調表示を利用しています。そのため、JCFファイルでツリーの選択箇所を強調表示として認識するためにカスタムハイライトを設定しています。

Include "HjGlobal.jsh" ; default HJ global variables
Include "hjconst.jsh" ; default HJ constants
include "jpn_inc.jsh"
include "LimeChat2.jsm"

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	int cid
let cid = GetControlId(focusWindow)
if DialogActive() then
	FocusChangedEvent (FocusWindow, PrevWindow)
	return
endif
SayWindowName(focusWindow, cid)
FocusChangedEvent (FocusWindow, PrevWindow)
EndFunction

void Function SayWindowName(handle focusWindow, int cid)
if isLogView(0) then
	if GetWindowClass(GetParent(GetParent(focusWindow))) == wcChatPanel then
		Say(cmsgChannelLog, OT_MESSAGE)
		SaySelectedChannel()
	else
		Say(cmsgLog, OT_MESSAGE)
	endif
elif cid == CID_INPUT then
	Say(cmsgInput, OT_MESSAGE)
endif
EndFunction

int Function isLogView(handle hWindow)
var
	string wcls,
	handle focusWindow,
	int focusCid
let focusWindow = GetFocus()
let focusCid = GetControlId(focusWindow)
if DialogActive() then
	if focusCid != CID_KEYWORD_HISTORY && focusCid != CID_URL_HISTORY then
		return 0
	endif
endif
	if hWindow then
		let wcls = GetWindowClass(hWindow)
	else
		let wcls = GetWindowClass(focusWindow)
	endif
	return wcls == wcLogView
EndFunction

string function GetSelectedChannel()
var
	string channelName,
	handle hServerTree
	let hServerTree = FindDescendantWindow(GetAppMainWindow(GetCurrentWindow()), CID_SERVERTREE)
	if hServerTree == 0 then
		return
	endif
	return GetWindowText(hServerTree, 1)
EndFunction

void Function SaySelectedChannel()
	Say(GetSelectedChannel(), OT_MESSAGE)
EndFunction

Script SayNextLine ()
if GlobalMenuMode || !isPCCursor() then
	PerformScript SayNextLine()
	return
EndIf
if isLogView(0) then
	NextLine()
	SayLine()
	return
endif
PerformScript SayNextLine()
EndScript

Script SayPriorLine ()
if GlobalMenuMode || !isPCCursor() then
	PerformScript SayPriorLine()
	return
EndIf
if isLogView(0) then
	PriorLine()
	SayLine()
	return
endif
PerformScript SayPriorLine()
EndScript

Script SayNextCharacter()
	if GlobalMenuMode || !isPCCursor() then
		PerformScript SayNextCharacter()
		return
	EndIf
	if isLogView(0) then
		PerformScript SayNextLine()
		return
 endif
	PerformScript SayNextCharacter()
EndScript

Script SayPriorCharacter()
	if GlobalMenuMode || !isPCCursor() then
		PerformScript SayPriorCharacter()
		return
	EndIf
	if isLogView(0) then
		PerformScript SayPriorLine()
		return
 endif
	PerformScript SayPriorCharacter()
EndScript

Script GoToChannelLog ()
var
	handle hWindow
	if DialogActive() then
		Say(cmsgNotMainWindow, OT_MESSAGE)
		return
	endif
	let hWindow = FindWindow(GetAppMainWindow(GetFocus()), wcChatPanel, "")
	let hWindow = GetFirstChild(hWindow)
	EnumerateChildWindows(hWindow, "SetFocusIfVisible")
EndScript

int Function SetFocusIfVisible(handle hWindow)
var
	int styleBits
let styleBits = GetWindowStyleBits(hWindow)
if styleBits & 0x10000000L then
	SetFocus(hWindow)
	return false
else
	return true
endif
EndFunction


Script GoToInput ()
var
	handle hWindow
	if DialogActive() then
		Say(cmsgNotMainWindow, OT_MESSAGE)
		return
	endif
	let hWindow = FindWindowWithClassAndId(GetAppMainWindow(GetFocus()), "EDIT", CID_INPUT)
	if hWindow then
		SetFocus(hWindow)
	endif
EndScript


Script GoToLog ()
var
	handle hWindow
	if DialogActive() then
		Say(cmsgNotMainWindow, OT_MESSAGE)
		return
	endif
	let hWindow = FindWindowWithClassAndId(GetAppMainWindow(GetFocus()), wcLOGVIEW, CID_LOG)
	if hWindow then
		SetFocus(hWindow)
	endif
EndScript


Script GoToUserList ()
var
	handle hWindow
	if DialogActive() then
		Say(cmsgNotMainWindow, OT_MESSAGE)
		return
	endif
	let hWindow = FindDescendantWindow(GetAppMainWindow(GetFocus()), CID_SUBWINDOW2)
	if hWindow then
		let hWindow = FindWindow(hWindow, wcCardLayoutPanel, "")
		EnumerateChildWindows(hWindow, "SetFocusIfVisible")
	endif
EndScript

Script GoToServerTree ()
var
	handle hWindow
	if DialogActive() then
		Say(cmsgNotMainWindow, OT_MESSAGE)
		return
	endif
	let hWindow = FindWindowWithClassAndId(GetAppMainWindow(GetFocus()), wcSysTreeview, CID_SERVERTREE)
	if hWindow then
		SetFocus(hWindow)
	endif
EndScript

Script Tab()
var
 handle inputWindow
let inputWindow = GetFocus()
if !IsPCCursor() || (GetControlId(inputWindow) != CID_INPUT) then
	PerformScript Tab()
	return
endif
if GetLine() == "" then
	; input field is blank
	PerformScript GoToLog()
else
	PerformScript Tab()
endif
EndScript

Script ShiftTab()
var
 handle inputWindow
let inputWindow = GetFocus()
if !IsPCCursor() || (GetControlId(inputWindow) != CID_INPUT) then
	PerformScript ShiftTab()
	return
endif
if GetLine() == "" then
	; input field is blank
	PerformScript GoToChannelLog()
else
	PerformScript ShiftTab()
endif
EndScript

function ClickURL ()
var
	int urlFound,
	int pos,
	string linestr
	SaveCursor ()
	RouteJAWSToPc ()
	JAWSCursor()
	let linestr = GetToEndOfLine()
	let pos = StringContains(linestr, "http")
	if (pos > 0) then
		let urlFound = 1
		while (pos > 0)
			NextCharacter()
			let pos = pos - 1
		endwhile
	endif
	if urlFound then
		PlaySound (FindJAWSSoundFile ("dodoop10.wav", FALSE))
		LeftMouseButton ()
		Pause ()
		LeftMouseButton ()
	else
		SayFormattedMessage(OT_ERROR, cmsgUrlNotFound_L, cmsgUrlNotFound_S)
	EndIf
	RestoreCursor ()
EndFunction

Script Enter()
	if isLogView(0) then
		ClickURL()
	else
		EnterKey()
	endif
EndScript

Script SelectAndSayChannel()
	TypeCurrentScriptKey()
	if g_bInImeComposition || DialogActive() then
		return
	endif
	Delay(1)
	SaySelectedChannel()
EndScript

Script MoveChannelUp()
	TypeCurrentScriptKey()
	SayMessage(OT_MESSAGE, FormatString(cmsgChannelUp, GetSelectedChannel()))
EndScript

Script MoveChannelDown()
	TypeCurrentScriptKey()
	SayMessage(OT_MESSAGE, FormatString(cmsgChannelDown, GetSelectedChannel()))
EndScript
