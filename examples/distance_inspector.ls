@version 2.2
@warnings
@script modeler

main
{
    reqbegin("Distance Inspector");
    a = ctlvector("Point A", <0,0,0>);
    b = ctlvector("Point B", <3,4,0>);
    if (!reqpost())
    {
        reqend();
        return;
    }
    p = getvalue(a);
    q = getvalue(b);
    reqend();

    d = q - p;
    length = sqrt(d.x*d.x + d.y*d.y + d.z*d.z);
    info("Distance: ", length);
}
