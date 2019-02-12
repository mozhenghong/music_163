{
    let view = {
        el: '.page>.main',
        template: `
            <h1>新建歌曲</h1>
            <form class="form">
                <div class="row"><label>歌名：<input name="name" type="text" value ="__name__"></label></div>
                <div class="row"> <label>歌手：<input name="singer" type="text" value = "__singer__"></label></div>
                <div class="row"> <label>外链：<input name="url" type="text" value ="__url__"></label></div>
                <div class="row"><button>保存</button></div>
            </form>
        `,
        render(data = {}) {
            let placeholders = ['name', 'url','singer','id']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        },
        reset(){
            this.render({})
        },
    }
    let model = {
        data: { name: '', singer: '', url: '', id: '' },
        create(data) {
            var Song = AV.Object.extend('song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            return song.save().then((newSong)=> {
                let {id,attributes} = newSong;
                Object.assign(this.data,{id,...attributes})
            },()=> {
                console.error(error);
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            this.bindEvents()
            window.eventHub.on('upload', (data) => {
                this.view.render(data)
            })
            window.eventHub.on('select',(data) =>{
                this.model.data = data
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            $(this.view.el).on('submit', 'form', (e) => {
                e.preventDefault()
                let needs = 'name singer url'.split(' ')
                let data = {}
                needs.map((string) => {
                    data[string] = $(this.view.el).find(`[name="${string}"]`).val()
                })
                this.model.create(data).then(() => {
                    // console.log(this.model.data)
                    this.view.reset()
                    let string = JSON.stringify(this.model.data)
                    let obj = JSON.parse(string)
                    window.eventHub.emit('create',obj)
                })
            })
        }
    }
    controller.init(view, model)
}