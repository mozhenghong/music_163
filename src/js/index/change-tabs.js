{
    let view = {
        el: '#tabs',
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.bindEvents();
        },
        bindEvents(){
            $(this.view.el).on('click', 'li', (e) => {
                $li = $(e.currentTarget);
                let tabName = $li.attr('data-tab-name')
                $li.addClass('active').siblings('.active').removeClass('active')
                window.eventHub.emit('changeTab',tabName)
            })
        }
    }
    controller.init(view,model)
}