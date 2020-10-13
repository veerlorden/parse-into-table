const app = document.getElementById('app')
let tBody = ''
let seed = ''

async function fetchUsers(page) {
  const request = `
    https://randomuser.me/api/?page=${page}&results=50&seed=${seed}
  `

  try {
    const response = await fetch(request)
    const json = await response.json()
    seed = json.info.seed
    app.innerHTML = createTable(json, page)
    tBody = document.querySelector('.table-users').tBodies[0]

    document.getElementById('search').addEventListener('input', searchValue)

  } catch (error) {
    console.warn(error)
  }
}

document.addEventListener('click', (event) => {
  if (event.target.dataset.type === 'page') {
    const page = parseInt(event.target.innerHTML)
    fetchUsers(page)
  }
  else if (event.target.dataset.type === 'btn') {
    fetchUsers(1)
  }
  else if (event.target.dataset.type === 'sort') {
    sortTable(event.target)
  }
})

function addUsersOnPage(users) {
  const usersList = users.map((user, index) => {
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${user.name.first}</td>
        <td>${user.name.last}</td>
        <td>${user.email}</td>
        <td>${user.location.country}</td>
        <td>${user.phone}</td>
        <td><img src="${user.picture.thumbnail}"></td>
      </tr>
    `
  })
  return usersList.join('')
}

function addPagination(count, active) {
  let pagination = ''
  for (let i = 0; i < count; i++) {
    if (active === i + 1) {
      pagination += `<li class="active" data-type="page">${i + 1}</li>`
      continue
    }
    pagination += `<li data-type="page">${i + 1}</li>`
  }
  return pagination
}

function createTable(json, page) {
  const list = addUsersOnPage(json.results)
  const pagination = addPagination(10, page)

  return `
    <header class="header">
      <div class="container" id="container">
        <div class="toolbar">
          <ul class="pagination">
            ${pagination}
          </ul>
          <div class="search">
            <input type="text" placeholder="Search" id="search">
          </div>
        </div>
      </div>
    </header>

    <main>
      <div class="container" id="container">
        <table class="table-users">
          <thead>
            <tr>
              <th data-type="sort">№</th>
              <th data-type="sort">First</th>
              <th data-type="sort">Last</th>
              <th data-type="sort">Email</th>
              <th data-type="sort">Country</th>
              <th data-type="sort">Phone</th>
              <th>Photo</th>
            </tr>
          </thead>
          <tbody>
            ${list}
          </tbody>
        </table>
      </div>
    </main>
  `
}

function sortTable(target) {
  const index = [...target.parentNode.cells].indexOf(target)
  const order = (target.dataset.order = -(target.dataset.order || -1))
  const collator = new Intl.Collator(['en', 'ru'], { numeric: true })

  const comparator = (index, order) => (a, b) => order * collator.compare(
    a.children[index].innerHTML,
    b.children[index].innerHTML
  )

  tBody.append(...[...tBody.rows].sort(comparator(index, order)))

  for (const cell of target.parentNode.cells) {
    cell.classList.toggle('sorted', cell === target)
  }
}

function searchValue() {
  let value = this.value.trim()

  const tableRows = tBody.rows
  if (value !== '') {
    [...tableRows].forEach(row => {
      for (i = 0; i < row.children.length; i++) {
        const cell = row.children[i]
        const position = cell.innerText.search(RegExp(value, "gi"))
        if (position === -1) {
          row.classList.add('hide')
        } else {
          row.classList.remove('hide')
          break
        }
      }
    })
  } else {
    [...tableRows].forEach(row => {
      row.classList.remove('hide')
    })
  }
}
