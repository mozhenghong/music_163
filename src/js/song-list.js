{
    let view = {
        el: '#songList-container',
        template:`
            <ul class="songList">
            </ul>
        `,
        render(data){
            $(this.el).html(this.template)
            let {songs} = data
            let liList = songs.map((song)=>{
                return $('<li></li>').text(song.name)
            })
            $(this.el).find('ul').empty()
            liList.map((domli)=>{
                $(this.el).find('ul').append(domli)
            })
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {songs: []},
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
            window.eventHub.on('upload',()=>{
                this.view.clearActive()
            })
            window.eventHub.on('create',(data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
            this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}