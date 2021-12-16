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
            mem_limit: "4G",
            depends_on: (if env=="prod" || env =="demo" then ["clone"]),
            settings: {
                repo: "gcr.io/rd7-project/"+imageName,
                tags: ["latest",env+"-${DRONE_COMMIT}","${DRONE_TAG}"],
                json_key: { "from_secret":"GOOGLE_CREDENTIALS"},
                build_args: ["website="+shortProduct,"product="+product],
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
    name: deployName+"Pipeline("+origin+ name +")",
    steps:[
        {

            name: "push2GCR-"+name,
            image: "plugins/gcr",
            mem_limit: "4G",
            depends_on: (if env=="prod" || env =="demo" then ["clone"]),
            settings: {
                repo: "gcr.io/rd7-project/"+imageName,
                tags: ["latest",env+"-${DRONE_COMMIT}","${DRONE_TAG}"],
                json_key: { "from_secret":"GOOGLE_CREDENTIALS"},
                build_args: ["website="+shortProduct,"product="+product],
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
local onlyimage(name,imageName,shortProduct)={
    name: "push2GCR-"+name,
    image: "plugins/gcr",
    mem_limit: "4G",
    depends_on:  ["clone"],
    settings: {
        repo: "gcr.io/rd7-project/"+imageName,
        tags: ["latest","${DRONE_COMMIT}","${DRONE_TAG}"],
        json_key: { "from_secret":"GOOGLE_CREDENTIALS"},
        build_args: ["website="+shortProduct],
    },
};

local onlyGKE(name="QA",cluster="xbb-common",zone="asia-east1-a"
,env="qa",deployName="yaboxxx-landing-page-qa",nginxssl="nginx-ssl",nginxConfig="yaboxxx-landing-page-nginx"
,imageName="yaboxxx-landingpage",nfs="10.27.1.218",product="yabo",origin="istio",nodePool="",nodePoolName="")={

            name: product + "GKE-"+ env +"(" + origin +")",
            image: "nytimes/drone-gke",
            depends_on: ["push2GCR-"+product],
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
local buildall2(name="QA",imageName="yaboxxx-landingpage",shortProduct="yb")={

    kind: "pipeline",
    name: "AllPipeline("+ name +")",
    steps:
    if name=="QA" then
    [
       # yabo
        onlyimage("yabo","yaboxxx-web","porn1"),
        onlyGKE("QA","yaboxxx-test","asia-east1-b"
            ,"qa","yabo-frontend-proxy-qa","","yabo-frontend-proxy-nginx-config-qa"
            ,"yaboxxx-web","10.27.1.218","yabo","istio","env","qa"),


        // # istio-yiyuan
        // onlyGKE("QA","yaboxxx-test","asia-east1-b"
        //     ,"qa","yiyuan-frontend-proxy-qa","","yiyuan-frontend-proxy-nginx-config-qa"
        //     ,"yaboxxx-web","10.27.1.218","yiyuan","istio","env","qa"),

        # istio-sigua
        onlyimage("sigua","yaboxxx-web","sg1"),
        onlyGKE("QA","yaboxxx-test","asia-east1-b"
            ,"qa","sigua-frontend-proxy-qa","","sigua-frontend-proxy-nginx-config-qa"
            ,"yaboxxx-web","10.27.1.218","sigua","istio","env","qa"),

        
        # istio-aubo
        onlyimage("aubo","yaboxxx-web","aobo1"),
        onlyGKE("QA","yaboxxx-test","asia-east1-b"
            ,"qa","aubo-frontend-qa","","aubo-frontend-nginx-config-qa"
            ,"yaboxxx-web","10.27.1.218","aubo","istio","env","qa"),

        # istio-sp51
        onlyimage("sp51","yaboxxx-web","sp1"),
        onlyGKE("QA","yaboxxx-test","asia-east1-b"
            ,"qa","sp51-frontend-qa","","sp51-frontend-nginx-config-qa"
            ,"yaboxxx-web","10.27.1.218","sp51","istio","env","qa"),
    ]else if name=="Beta" then  [
        # yabo
        onlyimage("yabo","yaboxxx-web","porn1"),
        onlyGKE("Beta","yaboxxx-prod","asia-east1-b"
            ,"beta","yabo-frontend-proxy-beta","","yabo-frontend-proxy-nginx-config-beta"
            ,"yaboxxx-web","10.17.3.48","yabo","istio","env","prod"),
        # sigua
        onlyimage("sigua","yaboxxx-web","porn1"),
        onlyGKE("Beta","yaboxxx-prod","asia-east1-b"
            ,"beta","sigua-frontend-proxy-beta","","sigua-frontend-proxy-nginx-config-beta"
            ,"yaboxxx-web","10.17.3.48","sigua","istio","env","prod"),
    ],
    trigger:
        conditionTrigger(name,shortProduct)
};

// local buildall(name="QA",imageName="yaboxxx-landingpage",shortProduct="yb")={
//     kind: "pipeline",
//     name: "AllPipeline("+ name +")",
//     steps:[
//         {

//             name: "push2GCR-"+name,
//             image: "plugins/gcr",
//             mem_limit: "2G",
//             depends_on:  ["clone"],
//             settings: {
//                 repo: "gcr.io/rd7-project/"+imageName,
//                 tags: ["latest","${DRONE_COMMIT}","${DRONE_TAG}"],
//                 json_key: { "from_secret":"GOOGLE_CREDENTIALS"},
//                 build_args: ["website="+shortProduct],
//             },
//         },
//     ]+
//     if name=="QA" then 
//     [
//         # yabo
//         onlyGKE("QA","yaboxxx-test","asia-east1-b"
//             ,"qa","yabo-frontend-proxy-qa","","yabo-frontend-proxy-nginx-config-qa"
//             ,"yaboxxx-web","10.27.1.218","yabo","istio","env","qa"),


//         // # istio-yiyuan
//         // onlyGKE("QA","yaboxxx-test","asia-east1-b"
//         //     ,"qa","yiyuan-frontend-proxy-qa","","yiyuan-frontend-proxy-nginx-config-qa"
//         //     ,"yaboxxx-web","10.27.1.218","yiyuan","istio","env","qa"),


//         # istio-sigua
//         onlyGKE("QA","yaboxxx-test","asia-east1-b"
//             ,"qa","sigua-frontend-proxy-qa","","sigua-frontend-proxy-nginx-config-qa"
//             ,"yaboxxx-web","10.27.1.218","sigua","istio","env","qa"),

        
//         # istio-aubo
//         onlyGKE("QA","yaboxxx-test","asia-east1-b"
//             ,"qa","aubo-frontend-qa","","aubo-frontend-nginx-config-qa"
//             ,"yaboxxx-web","10.27.1.218","aubo","istio","env","qa"),

//         # istio-sp51
//         onlyGKE("QA","yaboxxx-test","asia-east1-b"
//             ,"qa","sp51-frontend-qa","","sp51-frontend-nginx-config-qa"
//             ,"yaboxxx-web","10.27.1.218","sp51","istio","env","qa"),
//         // onlyGKE("QA","yaboxxx-prod","asia-east1-b"
//         //     ,"beta","sigua-frontend-proxy-beta","","sigua-frontend-proxy-nginx-config-beta"
//         //     ,"yaboxxx-web","10.17.3.48","sigua","istio","prod"),


//     ]else if name=="Beta" then  [
//         # yabo
//         onlyGKE("Beta","yaboxxx-prod","asia-east1-b"
//             ,"beta","yabo-frontend-proxy-beta","","yabo-frontend-proxy-nginx-config-beta"
//             ,"yaboxxx-web","10.17.3.48","yabo","istio","env","prod"),
//         // # yiyuan
//         // onlyGKE("Beta","yaboxxx-prod","asia-east1-b"
//         //     ,"beta","yiyuan-frontend-proxy-beta","","yiyuan-frontend-proxy-nginx-config-beta"
//         //     ,"yaboxxx-web","10.17.3.48","yiyuan","istio","env","prod"),
//         # sigua
//         onlyGKE("Beta","yaboxxx-prod","asia-east1-b"
//             ,"beta","sigua-frontend-proxy-beta","","sigua-frontend-proxy-nginx-config-beta"
//             ,"yaboxxx-web","10.17.3.48","sigua","istio","env","prod"),
            
//     ]else if name=="Prod" then [
//         # yabo
//         onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
//             ,"demo","yabo-frontend-proxy-demo","","yabo-frontend-proxy-nginx-config-demo"
//             ,"yaboxxx-web","10.17.1.94","yabo","istio","env","prod"),
//         onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
//             ,"prod","yabo-frontend-proxy-prod","","yabo-frontend-proxy-nginx-config-prod"
//             ,"yaboxxx-web","10.17.1.94","yabo","istio","env","prod"),
   
//         // # istio-yiyuan
//         // onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
//         //     ,"demo","yiyuan-frontend-proxy-demo","","yiyuan-frontend-proxy-nginx-config-demo"
//         //     ,"yaboxxx-web","10.17.1.94","yiyuan","istio","env","prod"),
//         // onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
//         //     ,"prod","yiyuan-frontend-proxy-prod","","yiyuan-frontend-proxy-nginx-config-prod"
//         //     ,"yaboxxx-web","10.17.1.94","yiyuan","istio","env","prod"),

//         # istio-sigua
//         onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
//             ,"demo","sigua-frontend-proxy-demo","","sigua-frontend-proxy-nginx-config-demo"
//             ,"yaboxxx-web","10.17.1.94","sigua","istio","env","prod"),
//         onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
//             ,"prod","sigua-frontend-proxy-prod","","sigua-frontend-proxy-nginx-config-prod"
//             ,"yaboxxx-web","10.17.1.94","sigua","istio","env","prod"),

//         # istio-aubo
//         onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
//             ,"demo","aubo-frontend-demo","","aubo-frontend-nginx-config-demo"
//             ,"yaboxxx-web","10.17.1.94","aubo","istio","env","prod"),
//         onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
//             ,"prod","aubo-frontend-prod","","aubo-frontend-nginx-config-prod"
//             ,"yaboxxx-web","10.17.1.94","aubo","istio","env","prod"),

//         # istio-sp51
//         onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
//             ,"demo","sp51-frontend-demo","","sp51-frontend-nginx-config-demo"
//             ,"yaboxxx-web","10.17.1.94","sp51","istio","env","prod"),
//         onlyGKE("Prod","yaboxxx-prod","asia-east1-b"
//             ,"prod","sp51-frontend-prod","","sp51-frontend-nginx-config-prod"
//             ,"yaboxxx-web","10.17.1.94","sp51","istio","env","prod"),

 
//     ],
//     trigger:
//         conditionTrigger(name,shortProduct)
//     // trigger:
//     //     ref: ["refs/heads/master"],
//     //     event: ["tag"],

// };

[

    // 12/15 原則更新，
    // master 只發 Prod & Demo
    // 其他分支 只發 QA & Beta
    # All
    buildall2("QA","yaboxxx-web","all"),
    buildall2("Beta","yaboxxx-web","all"),
    // buildall("Prod","yaboxxx-web","all"),


    # istio-sp51


    Pipeline("QA","yaboxxx-test","asia-east1-b"
    ,"qa","sp51-frontend-qa","","sp51-frontend-nginx-config-qa"
    ,"yaboxxx-web","10.27.1.218","sp51","istio","sp1","env","qa"),

    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","sp51-frontend-demo","","sp51-frontend-nginx-config-demo"
    // ,"yaboxxx-web","10.17.1.94","sp51","istio","sp1","env","prod"),

    // Build("Prod","yaboxxx-prod","asia-east1-b"
    // ,"demo","sp51-frontend-demo","","sp51-frontend-nginx-config-demo"
    // ,"yaboxxx-web","10.17.1.94","sp51","istio","env","prod",
    // "prod","yaboxxx-prod","sp51-frontend-prod","","sp51-frontend-nginx-config-prod"
    // ,"10.17.1.94","sp1","env","prod"),

    # istio-aubo


    Pipeline("QA","yaboxxx-test","asia-east1-b"
    ,"qa","aubo-frontend-qa","","aubo-frontend-nginx-config-qa"
    ,"yaboxxx-web","10.27.1.218","aubo","istio","aobo1","env","qa"),

//    Pipeline("Demo","yaboxxx-prod","asia-east1-b"
//     ,"demo","aubo-frontend-demo","","aubo-frontend-nginx-config-demo"
//     ,"yaboxxx-web","10.17.1.94","aubo","istio","aobo1","env","prod"),

    // Build("Prod","yaboxxx-prod","asia-east1-b"
    // ,"demo","aubo-frontend-demo","","aubo-frontend-nginx-config-demo"
    // ,"yaboxxx-web","10.17.1.94","aubo","istio","env","prod",
    // "prod","yaboxxx-prod","aubo-frontend-prod","","aubo-frontend-nginx-config-prod"
    // ,"10.17.1.94","aobo1","env","prod"),


    # istio-sigua
    
    // 2021/11/08 關閉，因應駭客攻擊，分tag佈署。
    // Build("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","sigua-frontend-proxy-qa","","sigua-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.218","sigua","istio","n2-8",
    // "beta","yaboxxx-prod","sigua-frontend-proxy-beta","","sigua-frontend-proxy-nginx-config-beta"
    // ,"10.17.3.48","sg","prod"),
    
    
    Pipeline("QA","yaboxxx-test","asia-east1-b"
    ,"qa","sigua-frontend-proxy-qa","","sigua-frontend-proxy-nginx-config-qa"
    ,"yaboxxx-web","10.27.1.218","sigua","istio","sg1","env","qa"),

    Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    ,"beta","sigua-frontend-proxy-beta","","sigua-frontend-proxy-nginx-config-beta"
    ,"yaboxxx-web","10.17.3.48","sigua","istio","sg1","env","prod"),

    Pipeline("QA","yaboxxx-test","asia-east1-b"
    ,"qa2","sigua-frontend-proxy-qa2","","sigua-frontend-proxy-nginx-config-qa2"
    ,"yaboxxx-web","10.27.1.218","sigua","istio","sg2","env","qa"),

    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","sigua-frontend-proxy-demo","","sigua-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.1.94","sigua","istio","sg1","env","prod"),

    // Build("Prod","yaboxxx-prod","asia-east1-b"
    // ,"demo","sigua-frontend-proxy-demo","","sigua-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.1.94","sigua","istio","env","prod",
    // "prod","yaboxxx-prod","sigua-frontend-proxy-prod","","sigua-frontend-proxy-nginx-config-prod"
    // ,"10.17.1.94","sg1","env","prod"),



    #istio-yabo
    // 2021/11/08 關閉，因應駭客攻擊，分tag佈署。
    // Build("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","yabo-frontend-proxy-qa","","yabo-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.218","yabo","istio","n2-8",
    // "beta","yaboxxx-prod","yabo-frontend-proxy-beta","","yabo-frontend-proxy-nginx-config-beta"
    // ,"10.17.3.48","yb","prod"),

    Pipeline("QA","yaboxxx-test","asia-east1-b"
    ,"qa","yabo-frontend-proxy-qa","","yabo-frontend-proxy-nginx-config-qa"
    ,"yaboxxx-web","10.27.1.218","yabo","istio","porn1","env","qa"),

    Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    ,"beta","yabo-frontend-proxy-beta","","yabo-frontend-proxy-nginx-config-beta"
    ,"yaboxxx-web","10.17.3.48","yabo","istio","porn1","env","prod"),

    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","yabo-frontend-proxy-demo","","yabo-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.1.94","yabo","istio","porn1","env","prod"),

    // Build("Prod","yaboxxx-prod","asia-east1-b"
    // ,"demo","yabo-frontend-proxy-demo","","yabo-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.1.94","yabo","istio","env","prod",
    // "prod","yaboxxx-prod","yabo-frontend-proxy-prod","","yabo-frontend-proxy-nginx-config-prod"
    // ,"10.17.1.94","yb","env","prod"),




]
