; JAWS Script for LimeChat2 (2.39 and higher)
; Copyright (c) 2009 Koichi Inoue

; LimeChat 2.30��œ�����m�F���Ă��܂��B
;
; JAWS��LimeChat2�𗘗p����ꍇ�A�ȉ��̐ݒ�����Ă����Ǝg���₷���Ȃ�܂��B
; �E�u�ݒ�v��ʂ�
;   - �u�g���C�A�C�R���v�ŁA�u�ŏ��������Ƃ��ɁA���C���E�C���h�[���^�X�N�o�[�ɕ\�����Ȃ��v���I���BALT+Tab�̑I���Ɍ���Ȃ��Ȃ�܂��B�^�X�N�g���C����A�N�Z�X�ł��܂��B
;   - �u�E�C���h�[�v�́u�z�b�g�L�[�ŃA�N�e�B�u�ɂ���v���I���B�K���ȃz�b�g�L�[�����蓖�Ă܂��B
; �E���C���E�C���h�[����u�ݒ�v���u�őO�ʂɕ\���v�̃`�F�b�N���O���܂��B���ꂪ�`�F�b�N����Ă���Ƒ��̃E�C���h�[�̓ǂݏグ��W���邱�Ƃ�����܂��B
;
; ���̃X�N���v�g�ŕύX����铮��͈ȉ��̒ʂ�ł��B
;   - ���̓t�B�[���h��Tab, Shift+Tab�����������A�t�B�[���h���󂾂����炻�ꂼ��S�̃��O�E�`���l�����O�Ɉړ����܂��B�{���͐ݒ�̃C���^�[�t�F�[�X�^�u�Ńj�b�N�l�[���⊮�𖳌��ɂ���K�v������܂����B

; ���Z�p���
; LimeChat2�̃E�C���h�[�͑傫����̃E�C���h�[(�R���g���[��ID��CID_SUBWINDOW1, CID_SUBWINDOW2)����\������Ă��܂��B
; CID_SUBWINDOW1�ɂ̓`���l�����O�A�S�̃��O�A���̓t�B�[���h������܂��B
; CID_SUBWINDOW2�ɂ̓��[�U���X�g�ƃT�[�o�c���[������܂��B
; �`���l�����O�ƃ��[�U���X�g�͓����Ă���`���l���������݂��Ă��āA�I������Ă���`���l���̂��̂�������悤�ɂȂ��Ă��܂��B�ړ��n�̃X�N���v�g�ł͂��̍\���𗘗p���ĖړI�̃R���g���[���������A�t�H�[�J�X�𓖂Ă�悤�ɂȂ��Ă��܂��B
; �`���l�����O�Ɉړ��������ɂ̓A�N�e�B�u�ȃ`���l������ǂݏグ�܂����A���̃`���l�����̓T�[�o�c���[�ŋ����\������Ă���ӏ�����擾���Ă��܂��B�܂��ACTRL+�㉺���ȂǂŃ`���l����؂�ւ������̓ǂݏグ�����l�ɋ����\���𗘗p���Ă��܂��B���̂��߁AJCF�t�@�C���Ńc���[�̑I���ӏ��������\���Ƃ��ĔF�����邽�߂ɃJ�X�^���n�C���C�g��ݒ肵�Ă��܂��B

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
