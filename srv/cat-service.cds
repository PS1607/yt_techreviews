using { yt_techreviews as db } from '../db/data-model';

service CatalogService@(path:'/CatalogService')
    {
        entity ReviewVideos as projection on db.ReviewVideos
    }