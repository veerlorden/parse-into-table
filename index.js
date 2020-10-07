const container = document.getElementById('table-users')
let seed = ''

async function fetchUsers(page) {
  const request = `https://randomuser.me/api/?page=${page}&results=50&seed=${seed}`

  try {
    const response = await fetch(request)
    const json = await response.json()
    container.innerHTML = createTable(json, page)
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
    const id = event.target.dataset.row
    sortTable(id)
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
        <td>${user.location.city}</td>
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
  seed = json.info.seed
  const list = addUsersOnPage(json.results)
  const pagination = addPagination(10, page)

  return `
    <ul class="pagination">
      ${pagination}
    </ul>
    <table>
      <thead>
        <tr>
          <th data-type="sort" data-row="0">№ <i class="fas fa-sort-down"></i></th>
          <th data-type="sort" data-row="1">First</th>
          <th data-type="sort" data-row="2">Last</th>
          <th data-type="sort" data-row="3">Email</th>
          <th data-type="sort" data-row="4">City</th>
          <th data-type="sort" data-row="5">Phone</th>
          <th data-row="6">Photo</th>
        </tr>
      </thead>
      <tbody>
        ${list}
      </tbody>
    </table>
    <ul class="pagination">
      ${pagination}
    </ul>
  `
}

function sortTable(id) {
  const rows = [...document.querySelectorAll('table tr')]
    .slice(1)
    .sort((rowA, rowB) => rowA.cells[id].innerHTML > rowB.cells[id].innerHTML
      ? 1
      : -1)

  document.querySelector('tbody').append(...rows)
}
