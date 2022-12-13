export function setup(helper) {
  if (!helper.markdownIt) {
    return;
  }

  helper.allowList([
    'div.p-notification',
    'div.p-notification--caution',
    'div.p-notification--positive',
    'div.p-notification--negative',
    'div.p-notification--important',
    'div.p-notification__response',
    'span.p-notification__status'
  ]);

  helper.registerPlugin(md => {
    md.block.bbcode.ruler.push('note', {
      tag: 'note',
      replace: function(state, tagInfo, content) {
        // Build up the notification class from the specified "type"
        // "p-notification--{type}"
        let notificationClass = 'p-notification';
        if (
          'type' in tagInfo.attrs &&
          ['caution', 'positive', 'negative', 'important'].includes(
            tagInfo.attrs.type.toLowerCase()
          )
        ) {
          notificationClass += '--' + tagInfo.attrs.type.toLowerCase();
        }

        // Start wrapper elements:
        // <div class="p-notification"><p class="p-notification__render">
        state.push('div_open', 'div', 1).attrSet('class', notificationClass);
        state.push('div_open', 'div', 1).attrSet('class', 'p-notification__response');
        // Add status:
        // <span class="p-notification__status">{status}</span>
        if ('status' in tagInfo.attrs) {
          state.push('span_open', 'span', 1).attrSet('class', 'p-notification__status');
          state.push('text', '', 0).content = tagInfo.attrs.status + ': ';
          state.push('span_close', 'span', -1);
        }

        // Add the [note] content
        const tokens = state.md.parse(content);
        tokens.forEach(element => {
          // For some reason, "inline" elements contain their text twice,
          // which duplicates the text on the page.
          // This is because the text appears both inside the "content" of the inline block,
          // and in a "text" child node of the block.
          // We therefore strip the "content", so the text only appears once.
          if (element.type == "inline") {
            element.content = ""
          }
          state.tokens.push(element)
        });
        
        // Close the wrapper elements
        state.push('div_close', 'div', -1);
        state.push('div_close', 'div', -1);

        return true;
      }
    });
    
  });
}
