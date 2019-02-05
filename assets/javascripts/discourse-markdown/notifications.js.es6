export function setup(helper) {
    if(!helper.markdownIt) { return; }
 
    helper.whiteList(
        [
            'div.p-notification',
            'div.p-notification--caution',
            'div.p-notification--positive',
            'p.p-notification__response',
            'span.p-notification__status',
            'span.p-notification__line'
        ]
    );

    helper.registerPlugin(md=>{
        md.block.bbcode.ruler.push('note', {
            tag: 'note',
            replace: function(state, tagInfo, content) {
                let status = "";
                let type = "";

                if ('status' in tagInfo.attrs) {
                    status = '<span class="p-notification__status">'
                    + tagInfo.attrs.status
                    + ':</span>'
                }

                if (
                    'type' in tagInfo.attrs
                    && ['caution', 'positive'].includes(tagInfo.attrs.type.toLowerCase())
                ) {
                    type = "--" + tagInfo.attrs.type.toLowerCase();
                }

                let notification_block = state.push('html_raw', '', 0);

                notification_block.content = '<div class="p-notification' + type + '">'
                    +  '  <p class="p-notification__response">'
                    +  status
                    +  '    <span class="p-notification__line">'
                    +  content
                    +  '    </span>'
                    +  '  </p>'
                    +  '</div>';

                return true;
            }
        });
    });
}
