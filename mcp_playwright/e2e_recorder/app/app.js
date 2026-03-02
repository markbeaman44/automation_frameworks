// app.js — executed via:  (new Function(appJs))()
// Runs in the page's global scope. No IIFE wrapper needed.
// ─────────────────────────────────────────────────────────────────────────────

var __recRoot = document.getElementById('__recorder_root__');
if (!__recRoot) {
  console.error('[Recorder] Root element missing — aborting.');
} else {
  (function (__recRoot) {
    // own scope, avoids polluting globals

    // ── Remove any stale document-level listeners from a previous injection ───
    if (window.__recHandlers) {
      document.removeEventListener('click', window.__recHandlers.click, true);
      document.removeEventListener('change', window.__recHandlers.change, true);
      document.removeEventListener('mousemove', window.__recHandlers.mousemove, true);
    }
    var actions = (window.__recorderInitialActions || []).slice();
    var isRecording = false;
    var isAssertMode = false;
    var hoveredEl = null;

    // UI refs
    var actionList = __recRoot.querySelector('#action-list');
    var btnPlayPause = __recRoot.querySelector('#btn-play-pause');
    var btnAssert = __recRoot.querySelector('#btn-assert');
    var btnGo = __recRoot.querySelector('#btn-go');
    var btnReplay = __recRoot.querySelector('#btn-replay');
    var urlInput = __recRoot.querySelector('#url-input');
    var highlight = __recRoot.querySelector('#picker-highlight');
    var modal = __recRoot.querySelector('#assertion-modal');
    var modalSel = __recRoot.querySelector('#modal-selector');
    var continueModal = __recRoot.querySelector('#continue-session-modal');

    // ── Role helper ───────────────────────────────────────────────────────────
    function getRole(el) {
      if (!el) return undefined;
      var role = el.getAttribute('role');
      if (role) return role;

      var tag = (el.tagName || '').toLowerCase();
      if (tag === 'button') return 'button';
      if (tag === 'input') {
        var t = (el.getAttribute('type') || 'text').toLowerCase();
        if (t === 'checkbox') return 'checkbox';
        if (t === 'radio') return 'radio';
        if (t === 'submit' || t === 'button' || t === 'reset') return 'button';
        if (t === 'search') return 'searchbox';
        return 'textbox';
      }
      if (tag === 'a' && el.getAttribute('href')) return 'link';
      if (tag === 'textarea') return 'textbox';
      if (tag === 'select') return 'combobox';
      if (tag === 'img') return 'img';
      if (/^h[1-6]$/.test(tag)) return 'heading';
      return undefined;
    }

    // ── Accessible Name helper ────────────────────────────────────────────────
    function getAccessibleName(el) {
      var ariaLabel = el.getAttribute('aria-label');
      if (ariaLabel) return ariaLabel;

      var ariaLabelledBy = el.getAttribute('aria-labelledby');
      if (ariaLabelledBy) {
        var labelEl = document.getElementById(ariaLabelledBy);
        if (labelEl) return (labelEl.innerText || labelEl.textContent || '').trim();
      }

      var ph = el.getAttribute('placeholder');
      if (ph) return ph;

      if (el.tagName.toLowerCase() === 'input' && (el.type === 'submit' || el.type === 'button')) {
        return el.value;
      }

      if (el.id) {
        var labelEl = document.querySelector('label[for="' + el.id + '"]');
        if (labelEl) return (labelEl.innerText || labelEl.textContent || '').trim();
      }

      var txt = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
      if (txt) return txt;

      return undefined;
    }

    // ── Selector helper ───────────────────────────────────────────────────────
    function getSelector(el, role) {
      if (!el || el === document.body || el === document.documentElement) return 'body';

      var testId = el.getAttribute && el.getAttribute('data-testid');
      if (testId) return '[data-testid="' + testId + '"]';

      var testIdAlt = el.getAttribute && el.getAttribute('data-test-id');
      if (testIdAlt) return '[data-test-id="' + testIdAlt + '"]';

      if (role) {
        var name = getAccessibleName(el);
        if (name) {
          return name;
        }
      }

      if (el.id) return '#' + el.id;
      var txt = (el.innerText || '').trim().replace(/\s+/g, ' ').substring(0, 30);
      if (txt && /^(BUTTON|A|LABEL|H[1-6])$/.test(el.tagName)) return 'text="' + txt + '"';
      var nm = el.getAttribute && el.getAttribute('name');
      if (nm) return '[name="' + nm + '"]';
      var ph = el.getAttribute && el.getAttribute('placeholder');
      if (ph) return '[placeholder="' + ph + '"]';
      var s = el.tagName.toLowerCase();
      if (typeof el.className === 'string') {
        var cls = el.className
          .split(' ')
          .filter(function (c) {
            return c.trim() && !c.startsWith('__rec');
          })
          .slice(0, 2)
          .join('.');
        if (cls) s += '.' + cls;
      }
      return s;
    }

    // ── Render action list ────────────────────────────────────────────────────
    function renderList(preserveScroll) {
      var prevScrollTop = actionList.scrollTop;
      actionList.innerHTML = '';
      if (actions.length === 0) {
        actionList.innerHTML =
          '<div style="text-align:center;color:#888;padding:24px;font-style:italic;">Waiting for actions...</div>';
        return;
      }
      actions.forEach(function (a, idx) {
        var card = document.createElement('div');
        card.className = 'action-card';
        var label = a.assertion ? 'ASSERT:' + a.assertion : a.type.toUpperCase();
        var body = a.selector + (a.value ? ' → "' + a.value + '"' : '');

        card.innerHTML =
          '<div class="card-row-top">' +
          '<span class="badge-type">' +
          label +
          '</span>' +
          '<div class="card-actions">' +
          '<button class="action-check-btn __rec-edit" data-idx="' +
          idx +
          '" title="Edit">✏️</button>' +
          '<button class="action-check-btn __rec-dup"  data-idx="' +
          idx +
          '" title="Duplicate">⿻</button>' +
          '<button class="action-check-btn __rec-del"  data-idx="' +
          idx +
          '" title="Delete">🗑️</button>' +
          '</div>' +
          '</div>' +
          '<div class="card-row-mid" id="__rec_mid_' +
          idx +
          '">' +
          body +
          '</div>' +
          '<div class="card-row-bot">' +
          '<span class="prompt-label">prompt</span>' +
          '<input class="prompt-input __rec-prompt" type="text" placeholder="AI instruction..." ' +
          'value="' +
          (a.userPrompt || '') +
          '" data-idx="' +
          idx +
          '">' +
          '</div>';

        actionList.appendChild(card);
      });

      if (preserveScroll) {
        actionList.scrollTop = prevScrollTop;
      } else {
        actionList.scrollTop = actionList.scrollHeight;
      }

      // Delete
      [].forEach.call(__recRoot.querySelectorAll('.__rec-del'), function (btn) {
        btn.onclick = function (e) {
          e.stopPropagation();
          var i = +btn.getAttribute('data-idx');
          if (window.onDeleteAction) window.onDeleteAction(i);
          actions.splice(i, 1);
          renderList(true);
        };
      });

      // Duplicate
      [].forEach.call(__recRoot.querySelectorAll('.__rec-dup'), function (btn) {
        btn.onclick = function (e) {
          e.stopPropagation();
          var i = +btn.getAttribute('data-idx');
          var copy = Object.assign({}, actions[i], { timestamp: Date.now() });
          actions.splice(i + 1, 0, copy);
          if (window.onDupAction) window.onDupAction(i);
          renderList(true);
        };
      });

      // Edit (inline)
      [].forEach.call(__recRoot.querySelectorAll('.__rec-edit'), function (btn) {
        btn.onclick = function (e) {
          e.stopPropagation();
          var i = +btn.getAttribute('data-idx');
          var mid = __recRoot.querySelector('#__rec_mid_' + i);

          if (!mid) return;

          var action = actions[i];
          var isInput = action && action.type === 'input';
          var isAssert = action && action.type === 'assert';
          var canRepick = action && (action.type === 'click' || isInput || isAssert);

          var REPICK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>';
          var SEL_WRAP = '<div class="edit-inline-wrap edit-inline-sel"><input class="edit-inline" type="text" placeholder="Selector" value="' + action.selector + '"><button class="edit-repick-btn" title="Re-pick element on page">' + REPICK_SVG + '</button></div>';

          if (isAssert) {
            // ── Assert: 2-row layout ─────────────────────────────────────────
            // Row 1: [selector+repick | assertion type dropdown]
            // Row 2: [attr name (conditional)] [expected value (conditional)]
            var ASSERT_ALL = ['toBeVisible', 'toBeEnabled', 'toBeDisabled', 'toBeChecked', 'toBeInViewport',
              'toHaveCount', 'toHaveText', 'toContainText', 'toHaveValue', 'toHaveValues',
              'toHaveClass', 'toHaveId', 'toHaveRole', 'toHaveAttribute', 'toHaveCSS', 'toHaveJSProperty'];
            var ASSERT_ATTR = ['toHaveAttribute', 'toHaveCSS', 'toHaveJSProperty'];
            var ASSERT_NOVAL = ['toBeVisible', 'toBeEnabled', 'toBeDisabled', 'toBeChecked', 'toBeInViewport'];

            var selOpts = ASSERT_ALL.map(function (t) {
              return '<option value="' + t + '"' + (t === action.assertion ? ' selected' : '') + '>' + t + '</option>';
            }).join('');

            mid.innerHTML =
              '<div class="edit-assert-row1">' + SEL_WRAP +
              '<select class="edit-assert-type">' + selOpts + '</select>' +
              '</div>' +
              '<div class="edit-assert-row2">' +
              '<input class="edit-inline edit-inline-attr" type="text" placeholder="Property name" value="' + (action.attributeName || '') + '">' +
              '<input class="edit-inline edit-inline-val"  type="text" placeholder="Expected value" value="' + (action.value || '') + '">' +
              '</div>';

          } else if (isInput) {
            // ── Input: 2-field row [selector+repick | value] ─────────────────
            mid.innerHTML =
              '<div class="edit-input-row">' + SEL_WRAP +
              '<input class="edit-inline edit-inline-val" type="text" placeholder="Value" value="' + (action.value || '') + '">' +
              '</div>';

          } else {
            // ── Click / Navigation: single selector field ────────────────────
            mid.innerHTML =
              '<div class="edit-inline-wrap">' +
              '<input class="edit-inline" type="text" value="' + action.selector + '">' +
              (canRepick ? '<button class="edit-repick-btn" title="Re-pick element on page">' + REPICK_SVG + '</button>' : '') +
              '</div>';
          }

          var inp = mid.querySelector('.edit-inline');         // selector (always first)
          var inpAttr = mid.querySelector('.edit-inline-attr');    // attributeName (assert only)
          var inpVal = mid.querySelector('.edit-inline-val');     // value
          var selAssert = mid.querySelector('.edit-assert-type');    // assertion type dropdown
          var row2 = mid.querySelector('.edit-assert-row2');    // second row (assert only)
          var isRepicking = false;

          inp.focus();
          inp.select();

          // ── Dynamic assert row2 visibility ───────────────────────────────
          var ASSERT_ATTR = ['toHaveAttribute', 'toHaveCSS', 'toHaveJSProperty'];
          var ASSERT_NOVAL = ['toBeVisible', 'toBeEnabled', 'toBeDisabled', 'toBeChecked', 'toBeInViewport'];
          function updateAssertRow2() {
            if (!selAssert || !row2) return;
            var type = selAssert.value;
            var needsAttr = ASSERT_ATTR.indexOf(type) >= 0;
            var needsVal = ASSERT_NOVAL.indexOf(type) < 0;
            if (inpAttr) inpAttr.style.display = needsAttr ? '' : 'none';
            if (inpVal) inpVal.style.display = needsVal ? '' : 'none';
            row2.style.display = needsVal ? '' : 'none';
          }
          updateAssertRow2(); // apply on open

          if (selAssert) {
            selAssert.onchange = updateAssertRow2;
          }

          // ── saveAll ───────────────────────────────────────────────────────
          function saveAll() {
            if (isRepicking) return;
            var active = document.activeElement;
            if (active === inp || active === inpAttr || active === inpVal || active === selAssert) return;
            var update = { selector: inp.value };
            actions[i].selector = inp.value;
            if (selAssert) { actions[i].assertion = selAssert.value; update.assertion = selAssert.value; }
            if (inpAttr) { actions[i].attributeName = inpAttr.value; update.attributeName = inpAttr.value; }
            if (inpVal) { actions[i].value = inpVal.value; update.value = inpVal.value; }
            if (window.onUpdateAction) window.onUpdateAction(i, update);
            renderList(true);
          }

          // Shared blur timer across all sibling fields
          var blurTimer = null;
          function scheduleSave() { clearTimeout(blurTimer); blurTimer = setTimeout(saveAll, 200); }

          function bindField(el) {
            if (!el) return;
            el.onblur = scheduleSave;
            el.onkeydown = function (ev) {
              if (ev.key === 'Enter') { clearTimeout(blurTimer); isRepicking = false; el.blur(); }
              if (ev.key === 'Escape') { clearTimeout(blurTimer); isRepicking = false; renderList(true); }
            };
          }
          bindField(inp);
          bindField(inpAttr);
          bindField(inpVal);
          if (selAssert) selAssert.onblur = scheduleSave;

          // ── Repick logic (shared for both layouts) ───────────────────────
          if (canRepick) {
            var repickBtn = mid.querySelector('.edit-repick-btn');
            repickBtn.onmousedown = function (ev) { ev.preventDefault(); };
            repickBtn.onclick = function (ev) {
              ev.stopPropagation();
              isRepicking = true;
              repickBtn.classList.add('picking');
              document.body.style.cursor = 'crosshair';
              highlight.classList.remove('hidden');

              function onRepickClick(ev) {
                if (__recRoot.contains(ev.target)) return;
                ev.preventDefault();
                ev.stopImmediatePropagation();
                var role = getRole(ev.target) || undefined;
                var sel = getSelector(ev.target, role);
                inp.value = sel;
                document.removeEventListener('click', onRepickClick, true);
                document.removeEventListener('mousemove', onRepickMove, true);
                highlight.classList.add('hidden');
                document.body.style.cursor = '';
                isRepicking = false;
                repickBtn.classList.remove('picking');
                inp.focus();
              }

              function onRepickMove(ev) {
                if (__recRoot.contains(ev.target)) return;
                var r = ev.target.getBoundingClientRect();
                highlight.classList.remove('hidden');
                highlight.style.top = r.top + 'px';
                highlight.style.left = r.left + 'px';
                highlight.style.width = r.width + 'px';
                highlight.style.height = r.height + 'px';
              }

              document.addEventListener('click', onRepickClick, true);
              document.addEventListener('mousemove', onRepickMove, true);
            };
          }
        };
      });

      // Prompt
      [].forEach.call(__recRoot.querySelectorAll('.__rec-prompt'), function (inp) {
        inp.onchange = function () {
          var i = +inp.getAttribute('data-idx');
          actions[i].userPrompt = inp.value;
          if (window.onUpdateAction) window.onUpdateAction(i, { userPrompt: inp.value });
        };
      });
    }

    // ── State restore (called from Node after navigation) ─────────────────────
    window.__recorderRestoreState = function (newActions, replaying) {
      actions = (newActions || []).slice();
      document.getElementById('__recorder_root__').classList.remove('rec-finished');

      if (replaying === true || replaying === false) {
        window.__recorderIsReplaying = replaying;
        if (!replaying && btnReplay) {
          btnReplay.classList.remove('spinning');
        }
      }

      renderList();
    };

    window.__recorderSetActiveStep = function (idx) {
      [].forEach.call(__recRoot.querySelectorAll('.action-card'), function (card, i) {
        if (i === idx) {
          card.classList.add('replaying-active');
          // Ensure it stays visible in the scrollable list
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          card.classList.remove('replaying-active');
        }
      });
    };

    // ── Global event listeners (capture phase) ────────────────────────────────
    // Named handlers stored on window so the NEXT injection can remove them first,
    // preventing stale listener accumulation across page navigations / re-injections.
    var __clickHandler = function (e) {
      if (window.__recorderIsReplaying) return;
      if (__recRoot.contains(e.target)) return; // ignore our own UI

      if (isAssertMode) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var role = getRole(e.target) || undefined;
        var sel = getSelector(e.target, role);
        modalSel.textContent = sel;

        // Capture text and value
        window.__recorderAssertTarget = e.target;
        window.__recorderAssertText = (e.target.innerText || e.target.textContent || '').trim();
        window.__recorderAssertValue = e.target.value || '';
        window.__recorderAssertRole = role;

        // Reset default state
        var paramsPanel = __recRoot.querySelector('#assertion-params-panel');
        if (paramsPanel) paramsPanel.classList.add('hidden');

        // Remove active from any existing, and check visibility
        [].forEach.call(__recRoot.querySelectorAll('.assertion-grid label'), function (lbl) {
          lbl.classList.remove('active');
        });

        var defRadio = __recRoot.querySelector('input[name="assertion-type"][value="toBeVisible"]');
        if (defRadio) {
          defRadio.checked = true;
          defRadio.parentElement.classList.add('active');
        }

        // Check node type to disable value-based assertions if not applicable
        var isInputLike =
          e.target.tagName && ['INPUT', 'TEXTAREA', 'SELECT'].indexOf(e.target.tagName.toUpperCase()) >= 0;
        [].forEach.call(__recRoot.querySelectorAll('.assertion-grid input[name="assertion-type"]'), function (radio) {
          var val = radio.value;
          var shouldDisable = false;
          if ((val === 'toHaveValue' || val === 'toHaveValues') && !isInputLike) {
            shouldDisable = true;
          }
          if (val === 'toBeChecked') {
            if (e.target.tagName !== 'INPUT' || (e.target.type !== 'checkbox' && e.target.type !== 'radio')) {
              shouldDisable = true;
            }
          }

          if (shouldDisable) {
            radio.disabled = true;
            radio.parentElement.classList.add('disabled');
          } else {
            radio.disabled = false;
            radio.parentElement.classList.remove('disabled');
          }
        });

        // Update params UI explicitly for the default selection
        var defEvent = new Event('change');
        if (defRadio) defRadio.dispatchEvent(defEvent);

        modal.classList.remove('hidden');
        highlight.classList.add('hidden');

        var oldBtn = __recRoot.querySelector('#btn-confirm-assert');
        var newBtn = oldBtn.cloneNode(true);
        oldBtn.parentNode.replaceChild(newBtn, oldBtn);
        newBtn.onclick = function () {
          var type = (__recRoot.querySelector('input[name="assertion-type"]:checked') || {}).value || 'toBeVisible';
          var attrName = __recRoot.querySelector('#assertion-attribute-name').value;
          var val = __recRoot.querySelector('#assertion-attribute-value').value;
          var needsName = type === 'toHaveAttribute' || type === 'toHaveCSS' || type === 'toHaveJSProperty';
          var needsValue =
            needsName ||
            [
              'toContainText',
              'toHaveClass',
              'toHaveId',
              'toHaveRole',
              'toHaveText',
              'toHaveValue',
              'toHaveValues',
            ].indexOf(type) >= 0;

          var action = {
            type: 'assert',
            selector: sel,
            assertion: type,
            value: needsValue ? val : undefined,
            role: role,
            attributeName: needsName ? attrName : undefined,
            timestamp: Date.now(),
          };
          actions.push(action);
          renderList();
          if (window.onAction) window.onAction(action);
          closeModal();
        };
        return;
      }

      if (isRecording) {
        var role = getRole(e.target) || undefined;
        var action = {
          type: 'click',
          selector: getSelector(e.target, role),
          tagName: e.target.tagName,
          role: role,
          timestamp: Date.now(),
        };
        actions.push(action);
        renderList();
        if (window.onAction) window.onAction(action);
      }
    };

    var __changeHandler = function (e) {
      if (window.__recorderIsReplaying) return;
      if (__recRoot.contains(e.target)) return;
      if (isRecording) {
        var role = getRole(e.target) || undefined;
        var action = {
          type: 'input',
          selector: getSelector(e.target, role),
          value: e.target.value,
          role: role,
          timestamp: Date.now(),
        };
        actions.push(action);
        renderList();
        if (window.onAction) window.onAction(action);
      }
    };

    var __mousemoveHandler = function (e) {
      if (window.__recorderIsReplaying) return;
      if (!isAssertMode || __recRoot.contains(e.target) || e.target === hoveredEl) return;
      hoveredEl = e.target;
      var r = e.target.getBoundingClientRect();
      highlight.classList.remove('hidden');
      highlight.style.top = r.top + 'px';
      highlight.style.left = r.left + 'px';
      highlight.style.width = r.width + 'px';
      highlight.style.height = r.height + 'px';
    };

    // Store refs on window so the next injection can clean up these listeners
    window.__recHandlers = { click: __clickHandler, change: __changeHandler, mousemove: __mousemoveHandler };
    document.addEventListener('click', __clickHandler, true);
    document.addEventListener('change', __changeHandler, true);
    document.addEventListener('mousemove', __mousemoveHandler, true);

    // ── Control buttons ───────────────────────────────────────────────────────
    function updatePlayPauseUI() {
      if (isRecording) {
        btnPlayPause.innerHTML = '⏸ PAUSE';
        btnPlayPause.classList.remove('btn-play');
        btnPlayPause.classList.add('btn-pause');
      } else {
        btnPlayPause.innerHTML = '▶ PLAY';
        btnPlayPause.classList.remove('btn-pause');
        btnPlayPause.classList.add('btn-play');
      }
    }

    btnPlayPause.onclick = function () {
      isRecording = !isRecording;
      updatePlayPauseUI();
    };

    btnAssert.onclick = function () {
      isAssertMode = !isAssertMode;
      btnAssert.classList.toggle('active', isAssertMode);
      document.body.style.cursor = isAssertMode ? 'crosshair' : 'default';
      if (!isAssertMode) highlight.classList.add('hidden');
    };

    // REPLAY: trigger playback in browser
    if (btnReplay) {
      btnReplay.onclick = function () {
        if (actions.length === 0) {
          alert('No actions recorded yet.');
          return;
        }
        btnReplay.classList.add('spinning');
        setTimeout(function () {
          btnReplay.classList.remove('spinning');
        }, 700);
        if (window.onReplay) window.onReplay();
      };
    }

    // GO button & Enter key
    btnGo.onclick = function () {
      var url = urlInput.value.trim();
      if (url && window.onNavigate) window.onNavigate(url);
    };
    urlInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') btnGo.click();
    });

    // ── Modal helpers ─────────────────────────────────────────────────────────
    function closeModal() {
      modal.classList.add('hidden');
      var paramsPanel = __recRoot.querySelector('#assertion-params-panel');
      if (paramsPanel) paramsPanel.classList.add('hidden');
      isAssertMode = false;
      btnAssert.classList.remove('active');
      document.body.style.cursor = 'default';
      highlight.classList.add('hidden');
    }

    __recRoot.querySelector('#btn-cancel-assert').onclick = closeModal;
    [].forEach.call(__recRoot.querySelectorAll('input[name="assertion-type"]'), function (r) {
      r.addEventListener('change', function (e) {
        // Remove active from all siblings
        [].forEach.call(__recRoot.querySelectorAll('.assertion-grid label'), function (lbl) {
          lbl.classList.remove('active');
        });
        if (e.target.checked && e.target.parentElement) {
          e.target.parentElement.classList.add('active');
        }

        var type = e.target.value;
        var paramsPanel = __recRoot.querySelector('#assertion-params-panel');
        var nameCont = __recRoot.querySelector('#assertion-name-container');
        var valCont = __recRoot.querySelector('#assertion-value-container');
        var nameInp = __recRoot.querySelector('#assertion-attribute-name');
        var valInp = __recRoot.querySelector('#assertion-attribute-value');
        var nameList = __recRoot.querySelector('#assertion-attribute-name-list');
        var target = window.__recorderAssertTarget;

        var needsName = type === 'toHaveAttribute' || type === 'toHaveCSS' || type === 'toHaveJSProperty';
        var needsValue =
          needsName ||
          [
            'toContainText',
            'toHaveClass',
            'toHaveId',
            'toHaveRole',
            'toHaveText',
            'toHaveValue',
            'toHaveValues',
          ].indexOf(type) >= 0;

        if (!needsName && !needsValue) {
          paramsPanel.classList.add('hidden');
          return;
        }
        paramsPanel.classList.remove('hidden');

        if (needsName) {
          nameCont.style.display = 'block';
          nameInp.placeholder =
            type === 'toHaveCSS'
              ? 'Type CSS property...'
              : type === 'toHaveJSProperty'
                ? 'Type JS property...'
                : 'Type HTML attribute...';
          var html = '';
          if (type === 'toHaveAttribute' && target && target.attributes) {
            for (var i = 0; i < target.attributes.length; i++) {
              html += '<option value="' + target.attributes[i].name + '">';
            }
          } else if (type === 'toHaveCSS' && target) {
            var computed = window.getComputedStyle(target);
            var props = [];
            for (var i = 0; i < computed.length; i++) {
              if (computed[i] && !computed[i].startsWith('-')) props.push(computed[i]);
            }
            props.sort();
            for (var i = 0; i < props.length; i++) {
              html += '<option value="' + props[i] + '">';
            }
          } else if (type === 'toHaveJSProperty' && target) {
            var props = [];
            for (var k in target) {
              if (typeof target[k] !== 'function' && typeof target[k] !== 'object') props.push(k);
            }
            props.sort();
            for (var i = 0; i < props.length; i++) {
              html += '<option value="' + props[i] + '">';
            }
          }
          if (nameList) nameList.innerHTML = html;
          if (nameInp.oninput) nameInp.oninput({});
          nameInp.focus();
        } else {
          nameCont.style.display = 'none';
          nameInp.value = '';
        }

        if (needsValue) {
          valCont.style.display = 'block';
          valInp.placeholder = 'Expected value...';

          if (!needsName) {
            if (type === 'toHaveText' || type === 'toContainText') {
              valInp.value = window.__recorderAssertText || '';
            } else if (type === 'toHaveValue' || type === 'toHaveValues') {
              valInp.value = window.__recorderAssertValue || '';
            } else if (type === 'toHaveClass' && target) {
              valInp.value = target.className || '';
            } else if (type === 'toHaveId' && target) {
              valInp.value = target.id || '';
            } else if (type === 'toHaveRole') {
              valInp.value = window.__recorderAssertRole || '';
            } else {
              valInp.value = '';
            }
            valInp.focus();
          }
        } else {
          valCont.style.display = 'none';
          valInp.value = '';
        }
      });
    });

    var attrNameInp = __recRoot.querySelector('#assertion-attribute-name');
    if (attrNameInp) {
      attrNameInp.oninput = function () {
        var type = (__recRoot.querySelector('input[name="assertion-type"]:checked') || {}).value;
        var target = window.__recorderAssertTarget;
        var propName = attrNameInp.value.trim();
        var valInp = __recRoot.querySelector('#assertion-attribute-value');

        if (target && propName && valInp) {
          if (type === 'toHaveCSS') {
            try {
              valInp.value = window.getComputedStyle(target).getPropertyValue(propName) || '';
            } catch (e) {
              valInp.value = '';
            }
          } else if (type === 'toHaveAttribute') {
            valInp.value = target.getAttribute(propName) || '';
          } else if (type === 'toHaveJSProperty') {
            valInp.value = target[propName] || '';
          }
        }
      };
    }

    // Initial render
    renderList();

    // Handle Session Choice Modal on startup
    if (window.__recorderNeedsChoice && continueModal && window.onSessionChoice) {
      continueModal.classList.remove('hidden');
      var btnNew = __recRoot.querySelector('#btn-session-new');
      var btnCont = __recRoot.querySelector('#btn-session-continue');
      if (btnNew) {
        btnNew.onclick = function () {
          continueModal.classList.add('hidden');
          window.onSessionChoice('new');
        };
      }
      if (btnCont) {
        btnCont.onclick = function () {
          continueModal.classList.add('hidden');
          window.onSessionChoice('continue');
        };
      }
    }

    console.log('[Recorder] V2 ready. Actions:', actions.length);
  })(__recRoot);
}
