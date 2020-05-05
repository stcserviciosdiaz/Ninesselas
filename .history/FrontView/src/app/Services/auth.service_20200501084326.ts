import { Usuario } from 'src/app/models/usuario';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlGenerica;

  urlFirmesa;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

    //this.urlGenerica = 'http://localhost:5000/';
    this.urlGenerica = 'https://servicio-ninesselas.herokuapp.com/';
  }

  /***********TOTALES USUARIOS *******/
  countUsers(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-login/countUsers');
  }

  countActor(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-login/countActor');
  }

  countFiguracion(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-login/countFiguracion');
  }

  countNinio(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-login/countNinio');
  }

  /********  USUARIO *******/
  finByIdUsuario(id): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-login/ver/' + id);
  }

  findUsuariosByTipo(expresion): Observable<any> {
    return this.http.post(this.urlGenerica + 'servicio-login/listar2', expresion);
  }

  editUser(user): Observable<any> {
    return this.http.put(this.urlGenerica + 'servicio-login/editar/' + user.idUser, user);
  }

  editUserPassword(password, idUser): Observable<any> {
    return this.http.put(this.urlGenerica + 'servicio-login/actualizaPassword/' + idUser, password);
  }

  deleteUser(id): Observable<any> {
    return this.http.delete(this.urlGenerica + 'servicio-login/eliminar/' + id);
  }

  signup2(newUser): Observable<any> {
    return this.http.post<any>(this.urlGenerica + 'servicio-login/crear', newUser);
  }

  login2(usuario, password, perfil): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-login/login/' + usuario + "/" + password + "/" + perfil);
  }
  findByToken(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-login/ver/' + this.getToken());
  }

  getUserByToken() {
    return this.http.get<Usuario>(this.urlGenerica + 'servicio-login/ver/' + this.getToken()).subscribe(res => { });
  }

  /******* FIN USUARIO *********/

  /***LIBRO FAMILIAR */
  saveLibroFamiliar(libro): Observable<any> {
    return this.http.post<any>(this.urlGenerica + 'servicio-libro-familiar/crear', libro);
  }

  deleteLibroFamiliar(idlibro): Observable<any> {
    return this.http.delete<any>(this.urlGenerica + 'servicio-libro-familiar/eliminar/' + idlibro);
  }

  editLibro(libro): Observable<any> {
    return this.http.put<any>(this.urlGenerica + 'servicio-libro-familiar/editar/' + libro.idLibro, libro);
  }

  findByIdLibro(idLibro): Observable<any> {
    return this.http.get<any>(this.urlGenerica + 'servicio-libro-familiar/ver/' + idLibro);
  }
  /***LIBRO FAMILIAR */


  /********  ETNIA *******/
  getAllEtinas(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-etnia/listar');
  }

  finByIdEtnia(id): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-etnia/ver/' + id);
  }

  saveEtnia(etnia): Observable<any> {
    return this.http.post<any>(this.urlGenerica + 'servicio-etnia/crear', etnia);
  }
  /******* FIN ETNIA *********/
  /********  BAILES *******/
  getAllBailarin(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-bailarin/listar');
  }

  finByIdBailarin(id): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-bailarin/ver/' + id);
  }

  getAllEstilosBailes(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-estilos-baile/listar');
  }

  finByIdEstilosBile(id): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-estilos-baile/ver/' + id);
  }
  /******* FIN BAILES *********/
  /********  CANTO *******/
  getAllCantante(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-cantante/listar');
  }

  finByIdCantante(id): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-cantante/ver/' + id);
  }

  getAllEstilosCanto(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-estilos-canto/listar');
  }

  finByIdEstilosCanto(id): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-estilos-canto/ver/' + id);
  }
  /******* FIN CANTOS *********/
  /********  HABILIDADES *******/
  getAllHabilidades(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-habilidades/listar');
  }

  finByIdHabilidades(id): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-habilidades/ver/' + id);
  }
  /******* FIN HABILIDADES *********/
  /********  IDIOMAS *******/
  getAllIdiomas(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-idiomas/listar');
  }

  finByIdIdiomas(id): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-idiomas/ver/' + id);
  }
  /******* FIN IDIOMAS *********/
  /********  DEPORTES *******/
  getAllDeportista(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-deportista/listar');
  }

  finByIdDeportista(id): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-deportista/ver/' + id);
  }

  getAllDeportes(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-deportes/listar');
  }

  finByIdDeportes(id): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-deportes/ver/' + id);
  }
  /******* FIN DEPORTES *********/
  /********  MUSICO *******/
  getAllMusico(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-musico/listar');
  }

  finByIdMusico(id): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-musico/ver/' + id);
  }

  getAllInstrumentos(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-instrumentos/listar');
  }

  finByIdInstrumento(id): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-instrumentos/ver/' + id);
  }

  /********  TALLAS *******/
  saveTalla(talla): Observable<any> {
    return this.http.post<any>(this.urlGenerica + 'servicio-tallas/crear', talla);
  }
  editTalla(talla, idTalla): Observable<any> {
    return this.http.put<any>(this.urlGenerica + 'servicio-tallas/editar/' + idTalla, talla);
  }
  /******* FIN TALLAS *********/

  /********  COCHE *******/
  saveCoche(coche): Observable<any> {
    return this.http.post<any>(this.urlGenerica + 'servicio-coche/crear', coche);
  }

  editCoche(coche): Observable<any> {
    return this.http.put<any>(this.urlGenerica + 'servicio-coche/editar/' + coche.idCoche, coche);
  }

  findByIdCoche(idCoche): Observable<any> {
    return this.http.get<any>(this.urlGenerica + 'servicio-coche/ver/' + idCoche);
  }

  deleteCoche(idcoche): Observable<any> {
    return this.http.delete<any>(this.urlGenerica + 'servicio-coche/eliminar/' + idcoche);
  }
  /******* FIN COCHE *********/

  /********  MOTO *******/
  saveMoto(moto): Observable<any> {
    return this.http.post<any>(this.urlGenerica + 'servicio-moto/crear', moto);
  }

  editMoto(moto): Observable<any> {
    return this.http.put<any>(this.urlGenerica + 'servicio-moto/editar/' + moto.idMoto, moto);
  }

  findByIdMoto(idMoto): Observable<any> {
    return this.http.get<any>(this.urlGenerica + 'servicio-moto/ver/' + idMoto);
  }

  deleteMoto(idmoto): Observable<any> {
    return this.http.delete<any>(this.urlGenerica + 'servicio-moto/eliminar/' + idmoto);
  }
  /******* FIN MOTO *********/

  /********  TATUAJES *******/
  saveTatuajes(tatuajes): Observable<any> {
    return this.http.post<any>(this.urlGenerica + 'servicio-fotosTatuajes/crear', tatuajes);
  }

  editTatuajes(tatuajes): Observable<any> {
    return this.http.put<any>(this.urlGenerica + 'servicio-fotosTatuajes/editar/' + tatuajes.idFotoTatuaje, tatuajes);
  }

  findByIdTatuaje(idTatuaje): Observable<any> {
    return this.http.get<any>(this.urlGenerica + 'servicio-fotosTatuajes/ver/' + idTatuaje);
  }

  deleteTatuaje(idtatuaje): Observable<any> {
    return this.http.delete<any>(this.urlGenerica + 'servicio-fotosTatuajes/eliminar/' + idtatuaje);
  }
  /******* FIN TATUAJES *********/

  /********  MANOS *******/
  saveManos(manos): Observable<any> {
    return this.http.post<any>(this.urlGenerica + 'servicio-fotosManos/crear', manos);
  }

  editManos(manos): Observable<any> {
    return this.http.put<any>(this.urlGenerica + 'servicio-fotosManos/editar/' + manos.idFotoMano, manos);
  }


  findByIdManos(idManos): Observable<any> {
    return this.http.get<any>(this.urlGenerica + 'servicio-fotosManos/ver/' + idManos);
  }

  deleteManos(idmanos): Observable<any> {
    return this.http.delete<any>(this.urlGenerica + 'servicio-fotosManos/eliminar/' + idmanos);
  }
  /******* FIN MANOS *********/

  /********* ULTIMOS TRABAJOS */
  saveUltimosTrabajos(ut): Observable<any> {
    return this.http.post<any>(this.urlGenerica + 'servicio-ultimosTrabajos/crear', ut);
  }

  editUltimosTrabajos(ut): Observable<any> {
    return this.http.put<any>(this.urlGenerica + 'servicio-ultimosTrabajos/editar/' + ut.idUltimosTrabajos, ut);
  }
  /********* FIN ULTIMOS TRABAJOS */
  valor: boolean = false;

  getAdmin(): boolean {
    return this.findByToken().pipe.
      .subscribe(res => {
      if (res.idType.nombres === 'ADMIN') {
        console.log('REGRESA TRUE');
        return true;
      } else {
        console.log('REGRESA FALSE');
        return false;
      }
    });

    return this.valor;
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  obtenerUsuario(): string {
    return localStorage.getItem('token');
  }

  logoutUser() {
    localStorage.removeItem('token'); 0
    this.router.navigate(['/home']);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-login/' + 'listar');
  }

  getAllCompanies(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-login/' + 'listar');
  }



}
