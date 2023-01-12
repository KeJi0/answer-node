# Answer-Node 
Answer-Node 是一个记笔记的工具，可以根据问题优先级随时发起提问。
### ./electron/connection.js 更改数据库连接
### 建表语句
create table question_answer
(
    id        bigint auto_increment
        primary key,
    title     varchar(128)  not null,
    content   varchar(4096) not null,
    reference varchar(4096) not null,
    pic       varchar(4096) null,
    priority  int           not null,
    times     int default 0 not null,
    constraint question_answer_id_uindex
        unique (id)
)
### 你可以通过以下命令启动它：
### npm install
### npm run dev 或 npm run estart
打包
### npm run ebuild
