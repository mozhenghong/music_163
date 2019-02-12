{
    let view = {
        el: '#songList-container',
        template:`
            <ul class="songList">
            </ul>
        `,
        render(data){
            $(this.el).html(this.template)
            let {songs,selectedSongId} = data
            let liList = songs.map((song)=>{
                let $li = $('<li></li>').text(song.name).attr('data-song-id',song.id)      
                if(song.id === selectedSongId){$li.addClass('active')}
                return $li
            })
            $(this.el).find('ul').empty()
            liList.map((domli)=>{
                $(this.el).find('ul').append(domli)
            })
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        },
        activeItem(li){
            let $li = $(li)
            $li.addClass('active').siblings('.active').removeClass('active')
        }
    }
    let model = {
        data: {songs: [],selectedSongId: undefined},
        find(){
            var query = new AV.Query('song');
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return {id: song.id, ...song.attributes}
                })
                return songs
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('upload',()=>{
                this.view.clearActive()
            })
            window.eventHub.on('create',(data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',() => {
                this.view.clearActive()
            })
            window.eventHub.on('update', (song)=>{
                let songs = this.model.data.songs
                for(let i=0; i<songs.length; i++){
                    if(songs[i].id === song.id){
                        Object.assign(songs[i], song)
                    }
                }
                this.view.render(this.model.data)
            })
            this.model.find().then(() => {
                this.view.render(this.model.data)
            })
            
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e) => {
                this.view.activeItem(e.currentTarget)
                let songId = e.currentTarget.getAttribute('data-song-id')
                this.model.data.selectedSongId = songId
                let songs = this.model.data.songs
                let data
                for (let i=0; i<songs.length; i++){
                    if(songs[i].id === songId){
                        data = songs[i]
                    }
                }
                window.eventHub.emit('select', JSON.parse(JSON.stringify(data)))
            })
        }
    }
    controller.init(view,model)
}