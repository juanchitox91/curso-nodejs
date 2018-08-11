import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';
import { SongService } from '../services/song.service';
import { Song } from '../models/song';

@Component({
	selector: 'album-detail',
	templateUrl: '../views/album-detail.html',
	providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit{
	public album: Album;
	public songs: Song[];
	public identity;
	public token;
	public url: string;
	public alertMessage;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
		private _songService: SongService

	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('album-detail.component.ts cargado');
		//Sacar album de la bbdd
		this.getAlbum();
	}


	getAlbum(){
		console.log('el metodo funciona');
		
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._albumService.getAlbum(this.token, id).subscribe(
				response => {

					if(!response.album){
						console.log('no pasa nada');
						this._router.navigate(['/']);
					}else{
						console.log('pasa todo kape');
						this.album = response.album;

						
						//sacar las canciones del album 
						this._songService.getSongs(this.token, response.album._id).subscribe(
						response =>{

							if(!response.songs){
								this.alertMessage = 'Este album no tiene canciones';
							}else{
								this.songs = response.songs;
							}
						}, error=>{
							var errorMessage = <any>error;

				  			if(errorMessage != null){
				  				var body = JSON.parse(error._body);
				  				//this.alertMessage = body.message;

				  				console.log(error);
				  			}
						});
					}
				}, error=>{
					var errorMessage = <any>error;

		  			if(errorMessage != null){
		  				var body = JSON.parse(error._body);
		  				//this.alertMessage = body.message;
		  				console.log(error);
		  			}
				}
			);

		});
	}

	public confirmado;

	onDeleteConfirm(id){
		this.confirmado = id;
	}

	onCancelSong(){
		this.confirmado = null;
	}

	onDeleteSong(id){
		this._songService.deleteSong(this.token, id).subscribe(
			response=>{
				debugger;
				if(!response.songRemoved){
					alert('Error en el servidor');
				}

				this.getAlbum();

			},error=>{
				var errorMessage = <any>error;

	  			if(errorMessage != null){
	  				var body = JSON.parse(error._body);
	  				//this.alertMessage = body.message;
	  				console.log(error);
	  			}
			});
	}
	
}