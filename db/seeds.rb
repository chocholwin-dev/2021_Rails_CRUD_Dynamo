# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Status.create(display_order: 1, status: '未作成', status_color: 'gray')
Status.create(display_order: 2, status: '作成中', status_color: 'lightblue')
Status.create(display_order: 3, status: '出力済', status_color: 'blue')
Status.create(display_order: 4, status: '方針確認中', status_color: 'green')