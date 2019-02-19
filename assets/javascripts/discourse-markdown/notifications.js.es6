export function setup(helper) {
    if(!helper.markdownIt) { return; }
 
    helper.whiteList(
        [
            'div.p-notification',
            'div.p-notification--caution',
            'div.p-notification--positive',
            'div.p-notification--negative',
            'div.p-notification--important',
            'p.p-notification__response',
            'span.p-notification__status'
        ]
    );

    helper.registerPlugin(md=>{
        md.block.bbcode.ruler.push("note", {
            tag: "note",
            replace: function(state, tagInfo, content) {
                // Build up the notification class from the specified "type"
                // "p-notification--{type}"
                let notificationClass = 'p-notification'
                if (
                    'type' in tagInfo.attrs
                    && ['caution', 'positive', 'negative', 'important'].includes(
                        tagInfo.attrs.type.toLowerCase()
                    )
                ) {
                    notificationClass += "--" + tagInfo.attrs.type.toLowerCase();
                }

                // Start wrapper elements:
                // <div class="p-notification"><p class="p-notification__render">
                state.push('div_open', 'div', 1).attrSet('class', notificationClass);
                state.push('paragraph_open', 'p', 1).attrSet('class', 'p-notification__response');

                // Add status:
                // <span class="p-notification__status">{status}</span>
                if ('status' in tagInfo.attrs) {
                    state.push('span_open', 'span', 1).attrSet('class', 'p-notification__status');
                    state.push('text', '', 0).content  = tagInfo.attrs.status + ": ";
                    state.push('span_close', 'span', -1);
                }

                // Add the [note] content inline
                let token = state.push('inline', '', 0);
                token.content  = content;
                token.children = [];

                // Close the wrapper elements
                state.push('paragraph_close', 'p', -1);
                state.push('div_close', 'div', -1);

                return true;
            }
        });
    });
}
