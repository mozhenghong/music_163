{
    let view = {
        el: 'section.songs',
        template: `
        <li id ="{{song.id}}">
            <h3>{{song.name}}</h3>
            <p>
                <svg class="icon icon-sq">
                    <use xlink:href="#icon-sq"></use>
                </svg>
               {{song.singer}}
            </p>
            <a class="playButton">
                <svg class="icon icon-play">
                    <use xlink:href="#icon-play"></use>
                </svg>
            </a>
        </li>
        `,
        render(data){
            let songs = data.songs;
            songs.map((song) => {
                let $li = $(this.template
                    .replace('{{song.name}}',song.name)
                    .replace('{{song.singer}}',song.singer)
                    .replace('{{song.id}}',song.id)
                    )
            $(this.el).find('ol.list').append($li)
            })
        }
    }
    let model = {
        data: {songs: []},
        find(){
            var query = new AV.Query('song');
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return Object.assign({id: song.id}, song.attributes)
                })
                return songs
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.model.find().then(() => {
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('click','li', (e) => {
                let id = e.currentTarget.getAttribute('id')
                console.log(id)
                location.href = `./song.html?id=${id}`
            })
        }
    }
    controller.init(view,model)
}