{
    let view = {
        el: '.page>.main-container>.main',
        template: `
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
            if(data.id){
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            }else{
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
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
        },
        update(data){
            let song = AV.Object.createWithoutData('song', this.data.id)
            song.set('name',data.name)
            song.set('singer',data.singer)
            song.set('url',data.url)
            return song.save().then((response) => {
                Object.assign(this.data, data)
                return response
            })
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
            window.eventHub.on('new',(data) => {
                if(this.model.data.id){
                    this.model.data = { name: '', singer: '', url: '', id: '' }
                }else{
                    Object.assign(this.model.data, data)
                }
                this.view.render(this.model.data)
            })
        },
        create(){
            let needs = 'name singer url'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = $(this.view.el).find(`[name="${string}"]`).val()
            })
            this.model.create(data).then(() => {
                this.view.reset()
                let string = JSON.stringify(this.model.data)
                let obj = JSON.parse(string)
                window.eventHub.emit('create',obj)
            })
        },
        update(){
            let needs = 'name singer url'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = $(this.view.el).find(`[name="${string}"]`).val()
            })
            this.model.update(data).then(() => {
                window.eventHub.emit('update',  JSON.parse(JSON.stringify(this.model.data)))
            })
        },
        bindEvents() {
            $(this.view.el).on('submit', 'form', (e) => {
                e.preventDefault()
                if(this.model.data.id){
                    this.update()
                }else{
                    this.create()
                }
                
            })
        }
    }
    controller.init(view, model)
}