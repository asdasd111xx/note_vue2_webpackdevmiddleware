#####################
### jsonnet convert to yaml
### command: dron jsonnet --steam
### 下完command後，會附蓋掉.drone.yml
#####################

// local switch(product)=
// {
//     if product =="yabo" then{
//         local tag = "yb";
//     }else if product == "yiyuan" then {
//         local tag = "ey";   
//     },

//     tag
// },

local conditionTrigger(env="qa",product="yb")=
(


    if env =="QA"  then {
        ref: ["refs/tags/"+ product +"QA-*"],
        event: ["tag"],
    }else if env=="Beta" then {
        ref: ["refs/tags/"+ product +"Beta-*"],
        event: ["tag"],
    }else if env=="Prod"  then  {
        ref: ["refs/tags/"+ product +"Prod-*"],
        event: ["tag"],
    }else if env== "Demo" then {
        ref: ["refs/tags/"+ product +"Demo-*"],
        event: ["tag"],
    }
);



local Build(name="QA",cluster="xbb-common",zone="asia-east1-a",
env="qa",deployName="yaboxxx-landing-page-qa",nginxssl="nginx-ssl",nginxConfig="yaboxxx-landing-page-nginx"
,imageName="yaboxxx-landingpage",nfs="10.27.1.218",product="yabo",origin="origin",nodePool="",nodePoolName="",
env2="",cluster2="",deployName2="",nginxssl2="",nginxConfig2="",nfs2="",shortProduct="yb",nodePool2="",nodePoolName2="")={
    kind: "pipeline",
    name: "Build"+product+"Pipeline("+origin+ name +")",
    steps:[
        {

            name: "push2GCR-"+name,
            image: "plugins/gcr",
            mem_limit: "2G",
            depends_on: (if env=="prod" || env =="demo" then ["clone"]),
            settings: {
                repo: "gcr.io/rd7-project/"+imageName,
                tags: ["latest",env+"-${DRONE_COMMIT}","${DRONE_TAG}"],
                json_key: { "from_secret":"GOOGLE_CREDENTIALS"},
                build_args: ["website="+env,"product="+product],
            },
        },
        {
            name: "deploy2GKE-"+env,
            image: "nytimes/drone-gke",
            depends_on: (if env=="prod" || env =="demo" then ["push2GCR-"+name]),
            environment:{
                TOKEN: {"from_secret": "GOOGLE_CREDENTIALS"},
            },
            settings:{
                project: "rd7-project",
                template:
                      if origin == "istio"  then "configs/"+ product+"/.istio-kube.yml"
                      else "configs/"+product+"/.kube.yml" ,                    
                vars:
                    {
                    "deployName":deployName,
                    "env":env,
                    "k8sNginxSSL":nginxssl,
                    "k8sNginxConfigMap":nginxConfig,
                    "imageName":"gcr.io/rd7-project/"+imageName+":${DRONE_TAG}",
                    "nfs":nfs,
                    "nodePool":nodePool,
                    "nodePoolName":nodePoolName,
                    }
                ,
                zone: zone,
                cluster: cluster,
            },
        },
        {
            name: "deploy2GKE-"+env2,
            image: "nytimes/drone-gke",
            depends_on: (if env=="prod" || env =="demo" then ["push2GCR-"+name]),
            environment:{
                TOKEN: {"from_secret": "GOOGLE_CREDENTIALS"},
            },
            settings:{
                project: "rd7-project",
                template:
                      if origin == "istio"  then "configs/"+ product+"/.istio-kube.yml"
                      else "configs/"+product+"/.kube.yml" ,                    
                vars:
                    {
                    "deployName":deployName2,
                    "env":env2,
                    "k8sNginxSSL":nginxssl2,
                    "k8sNginxConfigMap":nginxConfig2,
                    "imageName":"gcr.io/rd7-project/"+imageName+":${DRONE_TAG}",
                    "nfs":nfs2,
                    "nodePool":nodePool2,
                    "nodePoolName":nodePoolName2,
                    }
                ,
                zone: zone,
                cluster: cluster2,
            },
        },
        
    ],
    trigger:
        conditionTrigger(name,shortProduct)
    // trigger:
    //     ref: ["refs/heads/master"],
    //     event: ["tag"],

};

local Pipeline(name="QA",cluster="xbb-common",zone="asia-east1-a",
env="qa",deployName="yaboxxx-landing-page-qa",nginxssl="nginx-ssl",nginxConfig="yaboxxx-landing-page-nginx"
,imageName="yaboxxx-landingpage",nfs="10.27.1.218",product="yabo",origin="origin",shortProduct="yb",nodePool="",nodePoolName="") = {
    kind: "pipeline",
    name: "Pipeline"+product+"Pipeline("+origin+ name +")",
    steps:[
        {

            name: "push2GCR-"+name,
            image: "plugins/gcr",
            mem_limit: "2G",
            depends_on: (if env=="prod" || env =="demo" then ["clone"]),
            settings: {
                repo: "gcr.io/rd7-project/"+imageName,
                tags: ["latest",env+"-${DRONE_COMMIT}","${DRONE_TAG}"],
                json_key: { "from_secret":"GOOGLE_CREDENTIALS"},
                build_args: ["website="+env,"product="+product],
            },
            // when :
            //     conditionWhen(env)
            // when:
            // {
            //     branch: ["develop"]
            //     event: ["push"],
            // },
        },
        {
            name: "deploy2GKE-"+name,
            image: "nytimes/drone-gke",
            depends_on: (if env=="prod" || env =="demo" then ["push2GCR-"+name]),
            environment:{
                TOKEN: {"from_secret": "GOOGLE_CREDENTIALS"},
            },
            settings:{
                project: "rd7-project",
                template:
                      if origin == "istio"  then "configs/"+ product+"/.istio-kube.yml"
                      else "configs/"+product+"/.kube.yml" ,                    
                vars:
                    {
                    "deployName":deployName,
                    "env":env,
                    "k8sNginxSSL":nginxssl,
                    "k8sNginxConfigMap":nginxConfig,
                    "imageName":"gcr.io/rd7-project/"+imageName+":${DRONE_TAG}",
                    "nfs":nfs,
                    "nodePool":nodePool,
                    "nodePoolName":nodePoolName,
                    }
                ,
                zone: zone,
                cluster: cluster,
            },
            // when :
            //     conditionWhen(env)
        },
    ],
    trigger:
        conditionTrigger(name,shortProduct)
    // trigger:
    //     ref: ["refs/heads/master"],
    //     event: ["tag"],
};
local onlyGKE(name="QA",cluster="xbb-common",zone="asia-east1-a"
,env="qa",deployName="yaboxxx-landing-page-qa",nginxssl="nginx-ssl",nginxConfig="yaboxxx-landing-page-nginx"
,imageName="yaboxxx-landingpage",nfs="10.27.1.218",product="yabo",origin="istio",nodePool="",nodePoolName="")={

            name: product + "GKE-"+ env +"(" + origin +")",
            image: "nytimes/drone-gke",
            depends_on: ["push2GCR-"+name],
            environment:{
                TOKEN: {"from_secret": "GOOGLE_CREDENTIALS"},
            },
            settings:{
                project: "rd7-project",
                template:
                    if origin == "istio"  then "configs/"+ product+"/.istio-kube.yml"
                    else "configs/"+product+"/.kube.yml" ,      
                vars:
                    {
                    "deployName":deployName,
                    "env":env,
                    "k8sNginxSSL":nginxssl,
                    "k8sNginxConfigMap":nginxConfig,
                    "imageName":"gcr.io/rd7-project/"+imageName+":${DRONE_TAG}",
                    "nfs":nfs,
                    "nodePool":nodePool,
                    "nodePoolName":nodePoolName,
                    }
                ,
                zone: zone,
                cluster: cluster,
            },
        
};

local buildall(name="QA",imageName="yaboxxx-landingpage",shortProduct="yb")={
    kind: "pipeline",
    name: "AllPipeline("+ name +")",
    steps:[
        {

            name: "push2GCR-"+name,
            image: "plugins/gcr",
            mem_limit: "2G",
            depends_on:  ["clone"],
            settings: {
                repo: "gcr.io/rd7-project/"+imageName,
                tags: ["latest","${DRONE_COMMIT}","${DRONE_TAG}"],
                json_key: { "from_secret":"GOOGLE_CREDENTIALS"},
                // build_args: ["website="+env,"product="+product],
            },
        },
    ]+
    if name=="QA" then 
    [
        # yabo
        onlyGKE("QA","yaboxxx-test","asia-east1-b"
            ,"qa","yabo-frontend-proxy-qa","","yabo-frontend-proxy-nginx-config-qa"
            ,"yaboxxx-web","10.27.1.218","yabo","istio","env","qa"),


        # istio-yiyuan
        onlyGKE("QA","yaboxxx-test","asia-east1-b"
            ,"qa","yiyuan-frontend-proxy-qa","","yiyuan-frontend-proxy-nginx-config-qa"
            ,"yaboxxx-web","10.27.1.218","yiyuan","istio","env","qa"),


        # istio-sigua
        onlyGKE("QA","yaboxxx-test","asia-east1-b"
            ,"qa","sigua-frontend-proxy-qa","","sigua-frontend-proxy-nginx-config-qa"
            ,"yaboxxx-web","10.27.1.218","sigua","istio","env","qa"),

        
        # istio-aubo
        onlyGKE("QA","yaboxxx-test","asia-east1-b"
            ,"qa","aubo-frontend-qa","","aubo-frontend-nginx-config-qa"
            ,"yaboxxx-web","10.27.1.218","aubo","istio","env","qa"),

        # istio-sp51
        onlyGKE("QA","yaboxxx-test","asia-east1-b"
            ,"qa","sp51-frontend-qa","","sp51-frontend-nginx-config-qa"
            ,"yaboxxx-web","10.27.1.218","sp51","istio","env","qa"),
        // onlyGKE("QA","yaboxxx-prod","asia-east1-b"
        //     ,"beta","sigua-frontend-proxy-beta","","sigua-frontend-proxy-nginx-config-beta"
        //     ,"yaboxxx-web","10.17.3.48","sigua","istio","prod"),


    ]else if name=="Beta" then  [
        # yabo
        onlyGKE("Beta","yaboxxx-prod","asia-east1-b"
            ,"beta","yabo-frontend-proxy-beta","","yabo-frontend-proxy-nginx-config-beta"
            ,"yaboxxx-web","10.17.3.48","yabo","istio","env","prod"),
        # yiyuan
        onlyGKE("Beta","yaboxxx-prod","asia-east1-b"
            ,"beta","yiyuan-frontend-proxy-beta","","yiyuan-frontend-proxy-nginx-config-beta"
            ,"yaboxxx-web","10.17.3.48","yiyuan","istio","env","prod"),
        # sigua
        onlyGKE("Beta","yaboxxx-prod","asia-east1-b"
            ,"beta","sigua-frontend-proxy-beta","","sigua-frontend-proxy-nginx-config-beta"
            ,"yaboxxx-web","10.17.3.48","sigua","istio","env","prod"),
            
    ]else if name=="Prod" then [
        # yabo
        onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
            ,"demo","yabo-frontend-proxy-demo","","yabo-frontend-proxy-nginx-config-demo"
            ,"yaboxxx-web","10.17.1.94","yabo","istio","env","prod"),
        onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
            ,"prod","yabo-frontend-proxy-prod","","yabo-frontend-proxy-nginx-config-prod"
            ,"yaboxxx-web","10.17.1.94","yabo","istio","env","prod"),
   
        # istio-yiyuan
        onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
            ,"demo","yiyuan-frontend-proxy-demo","","yiyuan-frontend-proxy-nginx-config-demo"
            ,"yaboxxx-web","10.17.1.94","yiyuan","istio","env","prod"),
        onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
            ,"prod","yiyuan-frontend-proxy-prod","","yiyuan-frontend-proxy-nginx-config-prod"
            ,"yaboxxx-web","10.17.1.94","yiyuan","istio","env","prod"),

        # istio-sigua
        onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
            ,"demo","sigua-frontend-proxy-demo","","sigua-frontend-proxy-nginx-config-demo"
            ,"yaboxxx-web","10.17.1.94","sigua","istio","env","prod"),
        onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
            ,"prod","sigua-frontend-proxy-prod","","sigua-frontend-proxy-nginx-config-prod"
            ,"yaboxxx-web","10.17.1.94","sigua","istio","env","prod"),

        # istio-aubo
        onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
            ,"demo","aubo-frontend-demo","","aubo-frontend-nginx-config-demo"
            ,"yaboxxx-web","10.17.1.94","aubo","istio","env","prod"),
        onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
            ,"prod","aubo-frontend-prod","","aubo-frontend-nginx-config-prod"
            ,"yaboxxx-web","10.17.1.94","aubo","istio","env","prod"),

        # istio-sp51
        onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
            ,"demo","sp51-frontend-demo","","sp51-frontend-nginx-config-demo"
            ,"yaboxxx-web","10.17.1.94","sp51","istio","env","prod"),
        onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
            ,"prod","sp51-frontend-prod","","sp51-frontend-nginx-config-prod"
            ,"yaboxxx-web","10.17.1.94","sp51","istio","env","prod"),

 
    ],
    trigger:
        conditionTrigger(name,shortProduct)
    // trigger:
    //     ref: ["refs/heads/master"],
    //     event: ["tag"],

};

[
    # All
    buildall("QA","yaboxxx-web","all"),
    buildall("Beta","yaboxxx-web","all"),
    buildall("Prod","yaboxxx-web","all"),
    # yiyuan
    // Build("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","cxbb-frontend-proxy-qa","nginx-ssl-qa","cxbb-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.218","yiyuan","origin",
    // "beta","yaboxxx-prod","cxbb-frontend-proxy-beta","","cxbb-frontend-proxy-nginx-config-beta"
    // ,"10.17.3.48"),

    // Build("Prod","yaboxxx-prod","asia-east1-b"
    // ,"demo","cxbb-frontend-proxy-demo","nginx-ssl-qa","cxbb-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.1.94","yiyuan","origin",
    // "prod","yaboxxx-prod","cxbb-frontend-proxy-prod","","cxbb-frontend-proxy-nginx-config-prod"
    // ,"10.17.1.94"),

    # istio-sp51


    Pipeline("QA","yaboxxx-test","asia-east1-b"
    ,"qa","sp51-frontend-qa","","sp51-frontend-nginx-config-qa"
    ,"yaboxxx-web","10.27.1.218","sp51","istio","sp","env","qa"),

    Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    ,"demo","sp51-frontend-demo","","sp51-frontend-nginx-config-demo"
    ,"yaboxxx-web","10.17.1.94","sp51","istio","sp","env","prod"),

    Build("Prod","yaboxxx-prod","asia-east1-b"
    ,"demo","sp51-frontend-demo","","sp51-frontend-nginx-config-demo"
    ,"yaboxxx-web","10.17.1.94","sp51","istio","env","prod",
    "prod","yaboxxx-prod","sp51-frontend-prod","","sp51-frontend-nginx-config-prod"
    ,"10.17.1.94","sp","env","prod"),

    # istio-aubo


    Pipeline("QA","yaboxxx-test","asia-east1-b"
    ,"qa","aubo-frontend-qa","","aubo-frontend-nginx-config-qa"
    ,"yaboxxx-web","10.27.1.218","aubo","istio","ab","env","qa"),

   Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    ,"demo","aubo-frontend-demo","","aubo-frontend-nginx-config-demo"
    ,"yaboxxx-web","10.17.1.94","aubo","istio","ab","env","prod"),

    Build("Prod","yaboxxx-prod","asia-east1-b"
    ,"demo","aubo-frontend-demo","","aubo-frontend-nginx-config-demo"
    ,"yaboxxx-web","10.17.1.94","aubo","istio","env","prod",
    "prod","yaboxxx-prod","aubo-frontend-prod","","aubo-frontend-nginx-config-prod"
    ,"10.17.1.94","ab","env","prod"),

    # istio-yiyuan
    // 2021/11/08 關閉，因應駭客攻擊，分tag佈署。
    // Build("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","yiyuan-frontend-proxy-qa","","yiyuan-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.218","yiyuan","istio","n2-8",
    // "beta","yaboxxx-prod","yiyuan-frontend-proxy-beta","","yiyuan-frontend-proxy-nginx-config-beta"
    // ,"10.17.3.48","ey","prod"),

    Pipeline("QA","yaboxxx-test","asia-east1-b"
    ,"qa","yiyuan-frontend-proxy-qa","","yiyuan-frontend-proxy-nginx-config-qa"
    ,"yaboxxx-web","10.27.1.218","yiyuan","istio","ey","env","qa"),

    Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    ,"beta","yiyuan-frontend-proxy-beta","nginx-ssl-qa","yiyuan-frontend-proxy-nginx-config-beta"
    ,"yaboxxx-web","10.17.3.48","yiyuan","istio","ey","env","prod"),

    Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    ,"demo","yiyuan-frontend-proxy-demo","","yiyuan-frontend-proxy-nginx-config-demo"
    ,"yaboxxx-web","10.17.1.94","yiyuan","istio","ey","env","prod"),

    Build("Prod","yaboxxx-prod","asia-east1-b"
    ,"demo","yiyuan-frontend-proxy-demo","","yiyuan-frontend-proxy-nginx-config-demo"
    ,"yaboxxx-web","10.17.1.94","yiyuan","istio","env","prod",
    "prod","yaboxxx-prod","yiyuan-frontend-proxy-prod","","yiyuan-frontend-proxy-nginx-config-prod"
    ,"10.17.1.94","ey","env","prod"),


    // # sigua
    // Build("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","sgsp-frontend-proxy-qa","","sgsp-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.218","sigua","origin",
    // "beta","yaboxxx-prod","sgsp-frontend-proxy-beta","","sgsp-frontend-proxy-nginx-config-beta"
    // ,"10.17.3.48","sg"),

    // Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    // ,"beta","sgsp-frontend-proxy-beta","","sgsp-frontend-proxy-nginx-config-beta"
    // ,"yaboxxx-web","10.17.3.48","sigua","origin","sg"),

    // Build("Prod","yaboxxx-prod","asia-east1-b"
    // ,"demo","sgsp-frontend-proxy-demo","","sgsp-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.1.94","sigua","origin",
    // "prod","yaboxxx-prod","sgsp-frontend-proxy-prod","","sgsp-frontend-proxy-nginx-config-prod"
    // ,"10.17.1.94","sg"),

    # istio-sigua
    
    // 2021/11/08 關閉，因應駭客攻擊，分tag佈署。
    // Build("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","sigua-frontend-proxy-qa","","sigua-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.218","sigua","istio","n2-8",
    // "beta","yaboxxx-prod","sigua-frontend-proxy-beta","","sigua-frontend-proxy-nginx-config-beta"
    // ,"10.17.3.48","sg","prod"),
    
    
    Pipeline("QA","yaboxxx-test","asia-east1-b"
    ,"beta","sigua-frontend-proxy-beta","","sigua-frontend-proxy-nginx-config-qa"
    ,"yaboxxx-web","10.27.1.218","sigua","istio","sg","env","qa"),

    Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    ,"beta","sigua-frontend-proxy-beta","","sigua-frontend-proxy-nginx-config-beta"
    ,"yaboxxx-web","10.17.3.48","sigua","istio","sg","env","prod"),


    Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    ,"demo","sigua-frontend-proxy-demo","","sigua-frontend-proxy-nginx-config-demo"
    ,"yaboxxx-web","10.17.1.94","sigua","istio","sg","env","prod"),

    Build("Prod","yaboxxx-prod","asia-east1-b"
    ,"demo","sigua-frontend-proxy-demo","","sigua-frontend-proxy-nginx-config-demo"
    ,"yaboxxx-web","10.17.1.94","sigua","istio","env","prod",
    "prod","yaboxxx-prod","sigua-frontend-proxy-prod","","sigua-frontend-proxy-nginx-config-prod"
    ,"10.17.1.94","sg","env","prod"),

    # yabo
    // Build("QA","yaboxxx-test","asia-east1-b"
    // ,"test","frontend-proxy","frontend-proxy","frontend-proxy-nginx-config"
    // ,"yaboxxx-web","10.27.1.218","yabo","origin",
    // "beta","yaboxxx-prod","yabo-beta-frontend-proxy","yabo-frontend-proxy","yabo-beta-frontend-proxy-nginx-config"
    // ,"10.17.3.48"),
    // Build("Prod","yaboxxx-prod","asia-east1-b"
    // ,"demo","yabo-demo-frontend-proxy","yabo-frontend-proxy","yabo-demo-frontend-proxy-nginx-config"
    // ,"yaboxxx-web","10.17.1.94","yabo","origin",
    // "prod","yaboxxx-prod","yabo-prod-frontend-proxy","yabo-frontend-proxy","yabo-prod-frontend-proxy-nginx-config"
    // ,"10.17.1.94"),

    #istio-yabo
    // 2021/11/08 關閉，因應駭客攻擊，分tag佈署。
    // Build("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","yabo-frontend-proxy-qa","","yabo-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.218","yabo","istio","n2-8",
    // "beta","yaboxxx-prod","yabo-frontend-proxy-beta","","yabo-frontend-proxy-nginx-config-beta"
    // ,"10.17.3.48","yb","prod"),

    Pipeline("QA","yaboxxx-test","asia-east1-b"
    ,"qa","yabo-frontend-proxy-qa","","yabo-frontend-proxy-nginx-config-qa"
    ,"yaboxxx-web","10.27.1.218","yabo","istio","yb","env","qa"),

    Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    ,"beta","yabo-frontend-proxy-beta","","yabo-frontend-proxy-nginx-config-beta"
    ,"yaboxxx-web","10.17.3.48","yabo","istio","yb","env","prod"),

    Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    ,"demo","yabo-frontend-proxy-demo","","yabo-frontend-proxy-nginx-config-demo"
    ,"yaboxxx-web","10.17.1.94","yabo","istio","yb","env","prod"),

    Build("Prod","yaboxxx-prod","asia-east1-b"
    ,"demo","yabo-frontend-proxy-demo","","yabo-frontend-proxy-nginx-config-demo"
    ,"yaboxxx-web","10.17.1.94","yabo","istio","env","prod",
    "prod","yaboxxx-prod","yabo-frontend-proxy-prod","","yabo-frontend-proxy-nginx-config-prod"
    ,"10.17.1.94","yb","env","prod"),

    // Pipeline("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","yabo-frontend-proxy-qa","","yabo-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.218","yabo","istio"),
    // Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    // ,"beta","yabo-frontend-proxy-beta","","yabo-frontend-proxy-nginx-config-beta"
    // ,"yaboxxx-web","10.17.3.48","yabo","istio"),
    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","yabo-frontend-proxy-demo","","yabo-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.1.94","yabo","istio"),
    // Pipeline("Prod","yaboxxx-prod","asia-east1-b"
    // ,"prod","yabo-prod-frontend-proxy","","yabo-frontend-proxy-nginx-config-prod"
    // ,"yaboxxx-web","10.17.1.94","yabo","istio"),


//     (name="QA"（環境),cluster="xbb-common"（叢集),zone="asia-east1-a"(區域),
// env="qa"(GKE的label),deployName="yaboxxx-landing-page-qa"(GKE的名稱),nginxssl="nginx-ssl",nginxConfig="nginx"(GKE的configMap,nginx設定檔名稱),
// imageName="yaboxxx-landingpage"(GCR映像檔名稱),nfs="10.27.1.218"(nfs-server))
    
    // # sigua
    // Pipeline("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","sgsp-frontend-proxy-qa","","sgsp-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.218","sigua","origin"),
    // Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    // ,"beta","sgsp-frontend-proxy-beta","","sgsp-frontend-proxy-nginx-config-beta"
    // ,"yaboxxx-web","10.17.3.48","sigua","origin"),
    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","sgsp-frontend-proxy-demo","","sgsp-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.1.94","sigua","origin"),
    // Pipeline("Prod","yaboxxx-prod","asia-east1-b"
    // ,"prod","sgsp-frontend-proxy-prod","","sgsp-frontend-proxy-nginx-config-prod"
    // ,"yaboxxx-web","10.17.1.94","sigua","origin"),
    
    // # istio-sigua

    // Pipeline("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","sigua-frontend-proxy-qa","","sgsp-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.218","sigua","istio"),
    // Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    // ,"beta","sigua-frontend-proxy-beta","","sgsp-frontend-proxy-nginx-config-beta"
    // ,"yaboxxx-web","10.17.3.48","sigua","istio"),
    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","sigua-frontend-proxy-demo","","sgsp-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.1.94","sigua","istio"),
    // Pipeline("Prod","yaboxxx-prod","asia-east1-b"
    // ,"prod","sigua-frontend-proxy-prod","","sgsp-frontend-proxy-nginx-config-prod"
    // ,"yaboxxx-web","10.17.1.94","sigua","istio"),
    


    // # yabo(  nginxssl 屬特例情況，在客端沒在使用，故改用當label)
    // Pipeline("QA","yaboxxx-test","asia-east1-b"
    // ,"test","frontend-proxy","frontend-proxy","frontend-proxy-nginx-config"
    // ,"yaboxxx-web","10.27.1.218","yabo","origin"),
    // Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    // ,"beta","yabo-beta-frontend-proxy","yabo-frontend-proxy","yabo-beta-frontend-proxy-nginx-config"
    // ,"yaboxxx-web","10.17.3.48","yabo","origin"),
    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","yabo-demo-frontend-proxy","yabo-frontend-proxy","yabo-demo-frontend-proxy-nginx-config"
    // ,"yaboxxx-web","10.17.1.94","yabo","origin"),
    // Pipeline("Prod","yaboxxx-prod","asia-east1-b"
    // ,"prod","yabo-prod-frontend-proxy","yabo-frontend-proxy","yabo-prod-frontend-proxy-nginx-config"
    // ,"yaboxxx-web","10.17.1.94","yabo","origin"),

    // # istio-yabo
    // Pipeline("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","yabo-frontend-proxy-qa","","yabo-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.218","yabo","istio"),
    // Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    // ,"beta","yabo-frontend-proxy-beta","","yabo-frontend-proxy-nginx-config-beta"
    // ,"yaboxxx-web","10.17.3.48","yabo","istio"),
    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","yabo-frontend-proxy-demo","","yabo-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.1.94","yabo","istio"),
    // Pipeline("Prod","yaboxxx-prod","asia-east1-b"
    // ,"prod","yabo-prod-frontend-proxy","","yabo-frontend-proxy-nginx-config-prod"
    // ,"yaboxxx-web","10.17.1.94","yabo","istio"),

    // # yiyuan
    // Pipeline("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","cxbb-frontend-proxy-qa","nginx-ssl-qa","cxbb-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.218","yiyuan","origin"),
    // Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    // ,"beta","cxbb-frontend-proxy-beta","nginx-ssl-qa","cxbb-frontend-proxy-nginx-config-beta"
    // ,"yaboxxx-web","10.17.3.48","yiyuan","origin"),
    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","cxbb-frontend-proxy-demo","nginx-ssl-qa","cxbb-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.1.94","yiyuan","origin"),
    // Pipeline("Prod","yaboxxx-prod","asia-east1-b"
    // ,"prod","cxbb-frontend-proxy-prod","nginx-ssl-qa","cxbb-frontend-proxy-nginx-config-prod"
    // ,"yaboxxx-web","10.17.1.94","yiyuan","origin"),
    
    // # istio-yiyuan
    // Pipeline("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","yiyuan-frontend-proxy-qa","nginx-ssl-qa","yiyuan-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.218","yiyuan","istio"),
    // Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    // ,"beta","yiyuan-frontend-proxy-beta","nginx-ssl-qa","yiyuan-frontend-proxy-nginx-config-beta"
    // ,"yaboxxx-web","10.17.3.48","yiyuan","istio"),
    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","yiyuan-frontend-proxy-demo","nginx-ssl-qa","yiyuan-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.1.94","yiyuan","istio"),
    // Pipeline("Prod","yaboxxx-prod","asia-east1-b"
    // ,"prod","yiyuan-frontend-proxy-prod","nginx-ssl-qa","yiyuan-frontend-proxy-nginx-config-prod"
    // ,"yaboxxx-web","10.17.1.94","yiyuan","istio"),

]
