{
    let view = {}
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
                console.log(this.model.data)
            });
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
        }
    }
    controller.init(view,model)
    
}