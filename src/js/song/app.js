{
    let view = {
        el: '#app',
        render(){
        
        },
        play(){
            let audio = $(this.el).find('.audio')[0]
            audio.play()
        },
        pause(){
            let audio = $(this.el).find('.audio')[0]
            audio.pause()
        }
    }
    let model = {
        data: {
            id: '',
            name: '',
            singer: '',
            url: '',
        },
        setId(id){
            this.data.id = id
        },
        get(id){
            var query = new AV.Query('song');
            return query.get(id).then( (song) => {   
                Object.assign(this.data,{id: song.id, ...song.attributes})
                return song
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            let id = this.getId();
            this.model.setId(id)
            this.model.get(id).then(() => {
               this.view.render(this.model.data)
            });
            this.bindEvents();
        },
        getId() {
            let search = window.location.search
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
            }
            let array = search.split('&')
            
            let id = ''
            for (let i = 0; i < array.length; i++) {
                let kv = array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if (key === 'id') {
                    id = value
                }
            }
            return id
        },
        bindEvents(){
            $(this.view.el).on('click', '.play', () => {
                this.view.play()
            })  
            $(this.view.el).on('click', '.pause', () => {
                this.view.pause()
            })
        }
    }
    controller.init(view,model)
    
}