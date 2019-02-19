{
    let view = {
        el: '.loading',
        show(){
            $(this.el).addClass('active')
        },
        hide(){
            $(this.el).removeClass('active')
        }
    }
    let controller = {
        init(view){
            this.view = view
            window.eventHub.on('beforeUpload', () => {
                this.view.show()
            })
            window.eventHub.on('afterUpload', () => {
                this.view.hide()
            })
        }
    }
    controller.init(view)
}