export function setup(helper) {
    if(!helper.markdownIt) { return; }
 
    helper.whiteList(
        [
            'div.p-notification',
            'p.p-notification__response',
            'span.p-notification__status',
            'span.p-notification__line'
        ]
    );

    helper.registerPlugin(md=>{
        md.block.bbcode.ruler.push('note', {
            tag: 'note',
            replace: function(state, tagInfo, content) {
                let notification_block = state.push('html_raw', '', 0);
                notification_block.content = '<div class="p-notification">' +
                    '<p class="p-notification__response">' +
                    '  <span class="p-notification__status">Note:</span>' +
                    '  <span class="p-notification__line">' +
                    content +
                    '  </span>' +
                    '</p></div>';
                return true;
            }
        });
    });
}