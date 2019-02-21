{
    let view = {
        el: '#app',
        render(data){
            let {song, status} = data
            $(this.el).css('background-image', `url(${song.cover})`)
            $(this.el).find('img.cover').attr('src', song.cover)
            if($(this.el).find('audio').attr('src') !== song.url){
                $(this.el).find('audio').attr('src', song.url)
              }
        
            if(status === 'playing'){
                $(this.el).find('.disc-container').addClass('playing')
            }else{
                $(this.el).find('.disc-container').removeClass('playing')
            }
        },
        play(){
            $(this.el).find('audio')[0].play()
        },
        pause(){
            $(this.el).find('audio')[0].pause()
        }
    }
    let model = {
        data:{
            song: {
              id: '',
              name: '',
              singer: '',
              url: ''
            },
            status: 'paused'
        },
        get(id){
            var query = new AV.Query('song')
            return query.get(id).then((songs)=>{
              Object.assign(this.data.song, {id: songs.id, ...songs.attributes})
              return songs
            })
          }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            let id = this.getSongId()
            this.model.get(id).then(()=>{
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        getSongId(){
            let search = window.location.search
            if(search.indexOf('?') === 0){
              search = search.substring(1)
            }
      
            let array = search.split('&').filter((v=>v))
            let id = ''
      
            for(let i = 0 ;i<array.length; i++){
              let kv = array[i].split('=')
              let key = kv[0]
              let value = kv[1]
              if(key ==='id'){
                id = value
                break
              }
            }
            return id
        },
        bindEvents(){
            $(this.view.el).on('click', '.icon-play', () => {
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
                this.view.play()
            })
            $(this.view.el).on('click', '.icon-pause', () => {
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
                this.view.pause()
            })
            // bindEvents(){
            //     $(this.view.el).on('click', '.icon-play', ()=> {
            //       this.model.data.status = 'playing'
            //       this.view.render(this.model.data)
            //       this.view.play()
            //     })
            //     $(this.view.el).on('click', '.icon-pause', ()=> {
            //       this.model.data.status = 'paused'
            //       this.view.render(this.model.data)
            //       this.view.pause()
            //     })
            //     window.eventHub.on('songEnd', ()=>{
            //       this.model.data.status = 'paused'
            //       this.view.render(this.model.data)
            //     })
            //   },
        }
    }
    controller.init(view,model)
}