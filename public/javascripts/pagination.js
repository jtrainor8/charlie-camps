const paginate = document.getElementById('paginate');
const $campgroundsContainer = $('#campgrounds-container');
const $paginateButtton = $('#paginate');
paginate.addEventListener('click', function (e) {
    e.preventDefault();
    fetch(this.href)
        .then(response => response.json())
        .then(data => {
            for (const campground of data.docs) {
                let template = generateCampground(campground);
                $campgroundsContainer.append(template);
            }
            let { nextPage } = data;
            this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
            campgrounds.features.push(...data.docs);
            // map.getSource('campgrounds').setData(campgrounds);
            if(this.href.indexOf("null") > -1){
                paginate.style.display = "none";
                return;
            }
        })
    .catch(err => console.log('ERROR', err));

})

function generateCampground(campground) {
    let template = `<div class="card mb-3">
    <div class="row">
        <div class="col-md-4">
            <img class="img-fluid" style="height: 100%; width: 100%; object-fit: cover;" alt="" src="${campground.images.length ? campground.images[0].url.replace('/upload', '/upload/c_fill,h_250,w_400') : 'https://res.cloudinary.com/dahebw7tt/image/upload/c_fill,h_250,w_400/v1710465786/CharlieCamps/ugvu9pczejn2jpjhrisu.jpg'}">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                
                <h5 class="card-title">${campground.title} </h5>
    
                <p class="card-text">${campground.description.slice(0,200)}...</p>
                <p class="card-text">
                    <small class="text-muted">${campground.location}</small>
                </p>
                <a class="btn btn-info" href="/campgrounds/${campground._id}">View ${campground.title}</a>
            </div>
        </div>
    </div>
    </div>`;
    return template;
}