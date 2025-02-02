#[tauri::command]
pub fn open_directory(path: String) {
  #[cfg(target_os = "windows")]
  {
    use std::process::Command;

    Command::new("explorer")
      .args(["/select,", &path]) // The comma after select is not a typo
      .spawn()
      .unwrap();
  }

  #[cfg(target_os = "linux")]
  {
    use std::fs;
    use std::fs::metadata;
    use std::path::PathBuf;
    use std::process::Command;

    if path.contains(",") {
      // see https://gitlab.freedesktop.org/dbus/dbus/-/issues/76
      let new_path = match metadata(&path).unwrap().is_dir() {
        true => path,
        false => {
          let mut path2 = PathBuf::from(path);
          path2.pop();
          path2.into_os_string().into_string().unwrap()
        }
      };
      Command::new("xdg-open").arg(&new_path).spawn().unwrap();
    } else {
      Command::new("dbus-send")
        .args([
          "--session",
          "--dest=org.freedesktop.FileManager1",
          "--type=method_call",
          "/org/freedesktop/FileManager1",
          "org.freedesktop.FileManager1.ShowItems",
          format!("array:string:\"file://{path}\"").as_str(),
          "string:\"\"",
        ])
        .spawn()
        .unwrap();
    }
  }

  #[cfg(target_os = "macos")]
  {
    use std::process::Command;
    Command::new("open").args(["-R", &path]).spawn().unwrap();
  }
}
