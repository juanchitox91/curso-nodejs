import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService} from '../services/user.service';
import { AlbumService} from '../services/album.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
	selector: 'album-edit',
	templateUrl: '../views/album-add.html',
	providers: [UserService, AlbumService]
})

export class AlbumEditComponent implements OnInit{
	public titulo: string;
	public album: Album;
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public is_edit;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService
	){
		this.titulo = 'Editar album';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.album = new Album('','', 2017,'','');
		this.is_edit = true;

	}

	ngOnInit(){
		console.log('album-edit.component.ts cargado');

		//Conseguir el album
		this.getAlbum();
	}

	getAlbum(){
		this._route.params.forEach((params: Params)=>{
			let id =  params['id'];

			console.log(this.token);
			console.log(id);
						debugger;
			this._albumService.getAlbum(this.token, id).subscribe(
				response => {
						if(!response.album){
							this._router.navigate(['/']);
						}else{
							this.album = response.album;
						}
				}, 
				error => {
					var errorMessage = <any>error;

		  			if(errorMessage != null){
		  				var body = JSON.parse(error._body);
		  				console.log(error);
		  			}
				}
			);
		});
	}

	onSubmit(){
		this._route.params.forEach((params:Params) =>{
			let artist_id = params['artist'];
			this.album.artist = artist_id;

			this._albumService.addAlbum(this.token, this.album).subscribe(
				response => {
					if(!response.album){
						this.alertMessage = 'Error en el servidor';
					}else{
						this.alertMessage = 'El album se ha creado correctamente';
						this.album = response.album;
						//this._router.navigate(['/editar-album', response.artist._id]);
					}
				}, 
				error => {
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
}