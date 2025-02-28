import {PureComponent} from "react";
import {Box, Typography} from "@mui/joy";
import style from "@/layouts/login/logfloat.less";
import {curstyle} from "@/theme/curtheme";
import {Logo} from "@/layouts/reusable/logo/logo";
import reuse from "@/assets/reuseable.less"
import {Input1} from "@/layouts/reusable/input";
import {TextField} from "@mui/joy";
// import InputUnstyled from "@mui/base/InputUnstyled";
import Button from "@mui/joy/Button";
import {TextBtn} from "@/layouts/reusable/textbtn";
import {LogBarRegi} from "@/layouts/login/logbar_regi";
import {PaState} from "@/store/pastate";
import {PaStateMan} from "@/util/pa_state_man";
import {LogBarLog} from "@/layouts/login/logbar_log";
import {TagSetsComp} from "@/layouts/tag/tagsets_in_controlpanel";
import styled from "@emotion/styled";
import {TagSetCompNoWrap} from "@/layouts/tag/tag_set_nowrap";
import {UserBasicInfo} from "@/store/models/user";
import {RouteControl} from "@/store/route_control";


type Props = {
};
export class ArticleInfoView extends PureComponent<Props> {
    componentWillMount()  {
        PaStateMan.regist_comp(this,(registval, state)=>{
            registval(state.article,()=>{
                console.warn("article load", state.article)
            })
        })
        const articlep=PaStateMan.getstate().proxy_article
        articlep.sync_info_in_path();
        articlep.clear_cur_article_if_id_not_match();
        articlep.fetch_article_if_id_ok()
    }
    componentWillUnmount() {
        PaStateMan.unregist_comp(this)
    }
    state={
        userinfo:undefined
    }
    render() {
        console.warn("ArticleInfoView render")
        const logp=PaStateMan.getstate().proxy_log;
        const SetWrapper=styled.div``
        const articlep=PaStateMan.getstate().proxy_article
        const article=PaStateMan.getstate().proxy_article.get_cur_article()
        if(!article){

            console.warn("ArticleInfoView render undef")
            return undefined
        }
        // @ts-ignore
        const editable=article.author_id==logp.get_logged_basic().uid
        let authorname:string|undefined
        let userinfo=this.state.userinfo as UserBasicInfo|undefined;
        if(userinfo!=undefined){
            authorname=userinfo.username
        }else{
            PaStateMan.getstate().proxy_user.lazy_get_user_basic(article.author_id,
                (res,)=>{
                if(res){
                    this.setState({
                        userinfo:res
                    })
                }
            })
        }
        // @ts-ignore
        return (
            <Box
                className={reuse.col_flexcontainer}
                sx={{
                    padding:curstyle().gap.xxl,
                    gap:curstyle().gap.xxl
                }}>
                {/*编辑和删除文章按钮*/}
                {editable? <Box className={reuse.row_flex2side_container}>
                    <Button
                        sx={{
                            width: "calc(100% - 60px - "+curstyle().gap.common+")"
                        }}
                        onClick={() => {
                            const at=articlep.get_cur_article()
                            if(at){
                                RouteControl.replace_article_edit(at.id)
                                articlep.sync_info_in_path()
                            }
                        }}
                    >
                        编辑文章
                    </Button>
                    <Button
                        sx={{
                            width: "60px"
                        }}
                        onClick={() => {
                            if(confirm("删除文章不可恢复，请确认操作")){
                                PaStateMan.getstate().proxy_article
                                    .delete_article(article.id)
                                    .then((res)=>{
                                        if (res=="succ"){
                                            RouteControl.replace_index()
                                        }
                                    })
                            }
                        }}
                    >
                        删除
                    </Button>
                </Box>:undefined}
                <SetWrapper>
                    <Typography
                        level="h6"
                        sx={{
                            fontWeight: curstyle().fontweight.bold,
                            paddingBottom: curstyle().gap.common,

                        }}
                    >
                        标题
                    </Typography>
                    <Box
                        sx={{paddingLeft:curstyle().gap.common}}
                    >

                        {article.title}</Box>
                </SetWrapper>
                <SetWrapper>



                    <Typography
                        level="h6"
                        sx={{
                            fontWeight: curstyle().fontweight.bold,
                            paddingBottom: curstyle().gap.common,

                        }}
                    >
                        作者
                    </Typography>
                    <Box
                        sx={{paddingLeft:curstyle().gap.common}}
                    >
                        {authorname}</Box>
                </SetWrapper>
                {article.tag_ids.length>0?<SetWrapper>
                    <Typography
                        level="h6"
                        sx={{
                            fontWeight: curstyle().fontweight.bold,
                            paddingBottom: curstyle().gap.common,

                        }}
                    >
                        标签
                    </Typography>
                    <Box
                        sx={{paddingLeft:curstyle().gap.common}}
                    >

                        <TagSetCompNoWrap tags={article.tag_ids.map((id) => {
                            const find = PaStateMan.getstate().proxy_tag.findtag(id)
                            if (find) {
                                return find
                            } else {
                                return undefined
                            }
                        })}/>
                    </Box>
                </SetWrapper>:undefined}
            </Box>
        );
    }
}