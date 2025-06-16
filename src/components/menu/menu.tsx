// "use client";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { CiMenuKebab } from "react-icons/ci";
// import { TiThMenu } from "react-icons/ti";

// import { MoveToArchiveDialog } from "../archive/ArchiveDialog";

// import { DeletePhotoDialog } from "../photo/deletePhotoDialog";
// import { AddToAlbumDialog } from "../album/addToAlbumDialog";
// import { RemoveFromAlbumDialog } from "../album/removeFromAlbumDialog";

// import { EditAlbumDialog } from "../album/editAlbumDialog";
// import { DeleteAlbumDialog } from "../album/deleteAlbumDialog";

// export function PhotoMenu({
//   token,
//   photo,
//   photoList,
//   album = {
//     uid: '',
//     title: ''
//   },
//   albumList,
//   toArchive,
//   removeFromAlbum = false,
//   setPhotos,
// }: {
//   token: string;
//   photo: { uid: string };
//   photoList: {
//     uid: string;
//     file_name: string;
//     file_size: number;
//     file_format: string;
//     photo_binary: string;
//     photo_width: number;
//     photo_height: number;
//     is_liked: boolean;
//   }[];
//   album?: {
//     uid: string;
//     title: string;
//   };
//   albumList: {
//     uid: string;
//     title: string;
//     description: string;
//     cover_photo: string;
//     is_locked: boolean;
//     created_at: string;
//   }[];
//   toArchive: boolean;
//   removeFromAlbum: boolean;
//   setPhotos: React.Dispatch<
//     React.SetStateAction<
//       {
//         uid: string;
//         file_name: string;
//         file_size: number;
//         file_format: string;
//         photo_binary: string;
//         photo_width: number;
//         photo_height: number;
//         is_liked: boolean;
//       }[]
//     >
//   >;
// }) {
//   // menu for photo not in archive and not in album
//   if (toArchive && removeFromAlbum == false) {
//     return (
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           {/* <Button variant="ghost" className="w-6 h-6 p-0"> */}
//           <CiMenuKebab className="cursor-pointer" />
//           {/* </Button> */}
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="w-39">
//           <DropdownMenuItem asChild>
//             <AddToAlbumDialog
//               token={token}
//               photo={photo}
//               albumList={albumList}
//             />
//           </DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem asChild>
//             <MoveToArchiveDialog
//               token={token}
//               photo={photo}
//               photoList={photoList}
//               setPhotos={setPhotos}
//               toArchive={true}
//             />
//           </DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem asChild>
//             <DeletePhotoDialog
//               token={token}
//               photo={photo}
//               photoList={photoList}
//               setPhotos={setPhotos}
//             />
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     );
//   }

//   if (removeFromAlbum == true) {
//     return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             {/* <Button variant="ghost" className="w-6 h-6 p-0"> */}
//             <CiMenuKebab className="cursor-pointer" />
//             {/* </Button> */}
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-39">
//             <DropdownMenuItem asChild>
//               <AddToAlbumDialog
//                 token={token}
//                 photo={photo}
//                 albumList={albumList}
//               />
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild>
//               <RemoveFromAlbumDialog
//                 token={token}
//                 album={album}
//                 photoUid={photo.uid}
//                 photoList={photoList}
//                 setPhotos={setPhotos}
//               />
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild>
//               <MoveToArchiveDialog
//                 token={token}
//                 photo={photo}
//                 photoList={photoList}
//                 setPhotos={setPhotos}
//                 toArchive={true}
//               />
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild>
//               <DeletePhotoDialog
//                 token={token}
//                 photo={photo}
//                 photoList={photoList}
//                 setPhotos={setPhotos}
//               />
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         {/* <Button variant="ghost" className="w-6 h-6 p-0"> */}
//         <CiMenuKebab className="cursor-pointer" />
//         {/* </Button> */}
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-39">
//         <DropdownMenuItem asChild>
//           <AddToAlbumDialog token={token} photo={photo} albumList={albumList} />
//           {/* <BiAddToQueue className="mr-2 h-4 w-4" />
//           <span>Add to album</span> */}
//           {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem asChild>
//           <MoveToArchiveDialog
//             token={token}
//             photo={photo}
//             photoList={photoList}
//             setPhotos={setPhotos}
//             toArchive={false}
//           />
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem asChild>
//           <DeletePhotoDialog
//             token={token}
//             photo={photo}
//             photoList={photoList}
//             setPhotos={setPhotos}
//           />
//           {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// export function AlbumMenu({
//   token,
//   album,
//   albumList,
//   setAlbumList,
// }: {
//   token: string;
//   album: {
//     uid: string;
//     title: string;
//     description: string;
//     cover_photo: string;
//     is_locked: boolean;
//     created_at: string;
//   };
//   albumList: {
//     uid: string;
//     title: string;
//     description: string;
//     cover_photo: string;
//     is_locked: boolean;
//     created_at: string;
//   }[];
//   setAlbumList: React.Dispatch<
//     React.SetStateAction<
//       {
//         uid: string;
//         title: string;
//         description: string;
//         cover_photo: string;
//         is_locked: boolean;
//         created_at: string;
//       }[]
//     >
//   >;
// }) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         {/* <Button variant="ghost" className="w-4 h-4"> */}
//         <TiThMenu className="cursor-pointer w-6 h-10 p-0" />
//         {/* </Button> */}
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-39">
//         <DropdownMenuItem asChild>
//           <EditAlbumDialog
//             token={token}
//             album={album}
//             albumList={albumList}
//             setAlbumList={setAlbumList}
//           />
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem asChild disabled={album.is_locked}>
//           <DeleteAlbumDialog
//             token={token}
//             album={album}
//             albumList={albumList}
//             setAlbumList={setAlbumList}
//           />
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
