import { GitHubSearch } from "./gitHubSearch.js";

export class Favorite {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-fav:")) || [];
  }

  save() {
    localStorage.setItem("@github-fav:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username);
      if (userExists) {
        throw new Error("Usuário já favoritado");
      }
      const user = await GitHubSearch.search(username);

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!");
      }
      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    this.entries = this.entries.filter((entry) => entry.login !== user.login);
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorite {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onAdd();
  }

  onAdd() {
    const addFav = this.root.querySelector(".search button");
    addFav.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      this.add(value);
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Imagen de perfil de ${user.logj}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repos").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".remove").onclick = () => {
        const delConf = confirm("Tem certeza que deseja remover?");
        if (delConf) {
          this.delete(user);
        }
      };
      this.tbody.append(row);
    });
    if (this.tbody.querySelector("tr") === null) {
      document.querySelector(".noFav").classList.remove("hidden");
    } else {
      document.querySelector(".noFav").classList.add("hidden");
    }
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td class="user">
            <img
            src="https://github.com/LemnGT.png"
            alt="Imagem do Usuário LemnGT"
            />
            <div class="about">
            <a href="https://github.com/LemnGT" target="_blank">
                <p>Marcelo Gabriel</p>
                <span>/LemnGT</span>
            </a>
            </div>
        </td>
        <td class="repos">14</td>
        <td class="followers">4</td>
        <td class="remove"><button>Remover</button></td>
        
  `;
    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
